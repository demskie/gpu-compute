import { getWebGLContext, getMaxRenderBufferSize } from "./context";
import { ComputeShader } from "./computeShader";
import { getTransposeShader, getTransposeBufferInfo } from "./transposeShader";
import { BufferInfo, getComputeBufferInfo } from "./bufferInfo";

export class RenderTarget {
  public readonly width: number;
  private targetAlpha: { framebuffer: WebGLFramebuffer; texture: WebGLTexture };
  private targetBravo?: { framebuffer: WebGLFramebuffer; texture: WebGLTexture };

  public constructor(width: number, source?: { framebuffer: WebGLFramebuffer; texture: WebGLTexture }) {
    const maxSize = getMaxRenderBufferSize();
    if (!Number.isInteger(width) || width < 1 || width > maxSize)
      throw new Error(`ComputeTarget width of '${width}' is out of range (1 to ${maxSize})`);
    if ((Math.log(width) / Math.log(2)) % 1 !== 0)
      throw new Error(`ComputeTarget width of '${width}' is not a power of two`);
    this.width = width;
    this.targetAlpha = source ? source : this.createTarget();
  }

  public compute(
    computeShader: ComputeShader,
    uniforms?: { [key: string]: RenderTarget | number | Int32Array | Float32Array }
  ) {
    const gl = getWebGLContext();
    gl.useProgram(computeShader.program);
    this.setBuffers(computeShader, getComputeBufferInfo());
    if (uniforms) this.setUniforms(computeShader, uniforms);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.viewport(0, 0, this.width, this.width);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return this;
  }

  public transpose(scatterFragCoord: RenderTarget) {
    if (scatterFragCoord.width !== this.width)
      throw new Error(`scatterFragCoord width: '${scatterFragCoord.width}' != RenderTarget width: '${this.width}'`);
    const gl = getWebGLContext();
    const shader = getTransposeShader();
    gl.useProgram(shader.program);
    this.setBuffers(shader, getTransposeBufferInfo(this.width));
    this.setUniforms(shader, {
      u_scatterCoord: scatterFragCoord,
      u_sourceTex: this,
      u_textureWidth: this.width
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.viewport(0, 0, this.width, this.width);
    gl.drawArrays(gl.POINTS, 0, this.width * this.width);
    return this;
  }

  public pushSomePixels(x: number, y: number, w: number, h: number, bytes: Uint8Array) {
    if (bytes.length !== w * h * 4) throw new Error(`out.length !== ${w * h * 4}`);
    const gl = getWebGLContext();
    gl.bindTexture(gl.TEXTURE_2D, this.targetAlpha.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  private pushPixelsRecursively(x: number, y: number, w: number, h: number, l: number, o: Uint8Array, d: () => void) {
    const yStep = Math.min(Math.max(Math.floor(l / w), 1), h);
    this.pushSomePixels(x, y, w, yStep, o.subarray(0, 4 * w * yStep));
    if (h - yStep <= 0) return d();
    requestAnimationFrame(() =>
      this.pushPixelsRecursively(x, y + yStep, w, h - yStep, l, o.subarray(4 * w * yStep), d)
    );
  }

  public pushSomePixelsAsync(x: number, y: number, w: number, h: number, bytes: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      if (bytes.length !== w * h * 4) return reject(new Error(`out.length !== ${w * h * 4}`));
      this.pushPixelsRecursively(x, y, w, h, 512 * 512, bytes, () => resolve());
    });
  }

  public pushTextureData(bytes: Uint8Array) {
    const w = this.width;
    const n = bytes.length / 4;
    const z = (n - (n % w)) * 4;
    if (bytes.length > 4 * w * w) throw new Error(`array length of: '${bytes.length}' overflows: '${4 * w * w}'`);
    if (bytes.length % 4 > 0) throw new Error(`array length of: '${bytes.length}' is not a multiple of four`);
    if (w >= n) return this.pushSomePixels(0, 0, Math.min(n, w), Math.max(Math.floor(n / w), 1), bytes);
    this.pushSomePixels(0, 0, Math.min(n, w), Math.max(Math.floor(n / w), 1), bytes.subarray(0, z));
    if (4 * w * w > bytes.length) this.pushSomePixels(0, Math.floor(n / w), n % w, 1, bytes.subarray(z));
  }

  public pushTextureDataAsync(bytes: Uint8Array) {
    return new Promise((resolve, reject) => {
      const w = this.width;
      const n = bytes.length / 4;
      const z = (n - (n % w)) * 4;
      if (bytes.length > 4 * w * w)
        return reject(new Error(`array length of: '${bytes.length}' overflows: '${4 * w * w}'`));
      if (bytes.length % 4 > 0)
        return reject(new Error(`array length of: '${bytes.length}' is not a multiple of four`));
      if (w >= n) {
        this.pushSomePixelsAsync(0, 0, Math.min(n, w), Math.max(Math.floor(n / w), 1), bytes)
          .then(() => resolve())
          .catch(err => reject(err));
      } else if (4 * w * w > bytes.length) {
        this.pushSomePixelsAsync(0, 0, Math.min(n, w), Math.max(Math.floor(n / w), 1), bytes.subarray(0, z))
          .then(() =>
            this.pushSomePixelsAsync(0, Math.floor(n / this.width), n % this.width, 1, bytes.subarray(z))
              .then(() => resolve())
              .catch(err => reject(err))
          )
          .catch(err => reject(err));
      } else {
        this.pushSomePixelsAsync(0, 0, Math.min(n, w), Math.max(Math.floor(n / w), 1), bytes.subarray(0, z))
          .then(() => resolve())
          .catch(err => reject(err));
      }
    });
  }

  public readPixels(out?: Uint8Array) {
    return this.readSomePixels(0, 0, this.width, this.width, out);
  }

  public readPixelsAsync(out: Uint8Array) {
    return this.readSomePixelsAsync(0, 0, this.width, this.width, out);
  }

  public readSomePixels(x: number, y: number, width: number, height: number, out?: Uint8Array) {
    if (!out) out = new Uint8Array(width * height * 4);
    const gl = getWebGLContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, out);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return out;
  }

  private readPixelsRecursively(x: number, y: number, w: number, h: number, l: number, o: Uint8Array, d: () => void) {
    const yStep = Math.min(Math.max(Math.floor(l / w), 1), h);
    this.readSomePixels(x, y, w, yStep, o.subarray(0, 4 * w * yStep));
    if (h - yStep <= 0) return d();
    requestAnimationFrame(() =>
      this.readPixelsRecursively(x, y + yStep, w, h - yStep, l, o.subarray(4 * w * yStep), d)
    );
  }

  public readSomePixelsAsync(x: number, y: number, w: number, h: number, out?: Uint8Array): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (!out) out = new Uint8Array(w * h * 4);
      if (out.length !== w * h * 4) return reject(new Error(`out.length !== ${w * h * 4}`));
      this.readPixelsRecursively(x, y, w, h, 512 * 512, out, () => resolve(out));
    });
  }

  public delete() {
    const gl = getWebGLContext();
    gl.deleteTexture(this.targetAlpha.texture);
    gl.deleteFramebuffer(this.targetAlpha.framebuffer);
    if (this.targetBravo) {
      gl.deleteTexture(this.targetBravo.texture);
      gl.deleteFramebuffer(this.targetBravo.framebuffer);
    }
  }

  public getBackbuffer() {
    return this.targetBravo ? new RenderTarget(this.width, this.targetBravo) : null;
  }

  public deleteBackbuffer() {
    if (this.targetBravo) {
      const gl = getWebGLContext();
      gl.deleteTexture(this.targetBravo.texture);
      gl.deleteFramebuffer(this.targetBravo.framebuffer);
    }
  }

  private setBuffers(computeShader: ComputeShader, bufferInfo: BufferInfo) {
    const gl = getWebGLContext();
    for (var attrName in bufferInfo) {
      const buffer = bufferInfo[attrName]["buffer"];
      const numComponents = bufferInfo[attrName]["numComponents"];
      const index = computeShader.attributeInfo[attrName]["location"] as number;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(index, numComponents, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  }

  private setUniforms(
    computeShader: ComputeShader,
    uniformValues: { [key: string]: RenderTarget | number | Int32Array | Float32Array }
  ) {
    let shouldSwap = false;
    const gl = getWebGLContext();
    for (let uniformName in computeShader.uniformInfo) {
      const value = uniformValues[uniformName] as RenderTarget;
      if (computeShader.uniformInfo[uniformName]["type"] === gl.SAMPLER_2D && value === this.targetAlpha.texture)
        shouldSwap = true;
      if (this.targetBravo && value.targetBravo && value.targetBravo.texture === this.targetBravo.texture)
        throw new Error(`provided uniform: '${uniformName}' cannot be the RenderTarget's backbuffer`);
    }
    let textureUnit = 0;
    for (let uniformName in computeShader.uniformInfo) {
      const value = uniformValues[uniformName];
      const type = computeShader.uniformInfo[uniformName]["type"];
      const location = computeShader.uniformInfo[uniformName]["location"];
      switch (type) {
        case gl.SAMPLER_2D:
          if (Array.isArray(value) || typeof value === "number")
            throw new Error(`provided uniform: '${uniformName}' is not a WebGLTexture`);
          gl.uniform1i(location, textureUnit);
          gl.activeTexture(gl.TEXTURE0 + textureUnit++);
          gl.bindTexture(gl.TEXTURE_2D, (value as RenderTarget).targetAlpha.texture);
          break;
        case gl.FLOAT:
          if (typeof value === "number") {
            gl.uniform1f(location, value);
          } else if (Array.isArray(value)) {
            gl.uniform1fv(location, value);
          }
          break;
        case gl.FLOAT_VEC2:
        case gl.FLOAT_VEC3:
        case gl.FLOAT_VEC4:
          throw new Error("uniform vectors are currently unsupported");
        default:
          throw new Error(`unsupported uniform type: '${type}'`);
      }
    }
    if (shouldSwap) {
      if (!this.targetBravo) this.targetBravo = this.createTarget();
      [this.targetAlpha, this.targetBravo] = [this.targetBravo, this.targetAlpha];
    }
  }

  private createTarget() {
    const gl = getWebGLContext();
    const fb = gl.createFramebuffer();
    if (!fb) throw new Error("unable to create framebuffer");
    const tx = gl.createTexture();
    if (!tx) throw new Error("unable to create texture");
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.width, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { framebuffer: fb, texture: tx } as {
      framebuffer: WebGLFramebuffer;
      texture: WebGLTexture;
    };
  }
}
