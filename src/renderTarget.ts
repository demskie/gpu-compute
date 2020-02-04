/* eslint-disable @typescript-eslint/no-unused-vars */
import { setWebGLContext, getWebGLContext, isWebGL2, getMaxRenderBufferSize } from "./context";
import { ComputeShader } from "./computeShader";
import { getTransposeShader, getTransposeBufferInfo } from "./transposeShader";
import { BufferInfo, getComputeBufferInfo } from "./bufferInfo";

export interface Uniforms {
  [key: string]: RenderTarget | number | Int32Array | Float32Array;
}

export class RenderTarget {
  public readonly width: number;
  private targetAlpha: { framebuffer: WebGLFramebuffer; texture: WebGLTexture };
  private targetBravo?: { framebuffer: WebGLFramebuffer; texture: WebGLTexture };

  public constructor(width: number, ctx?: WebGLRenderingContext | WebGL2RenderingContext) {
    ctx = (ctx ? setWebGLContext(ctx) : getWebGLContext()) as WebGLRenderingContext | WebGL2RenderingContext;
    const maxSize = getMaxRenderBufferSize();
    if (!Number.isInteger(width) || width < 1 || width > maxSize)
      throw new Error(`ComputeTarget width of '${width}' is out of range (1 to ${maxSize})`);
    if ((Math.log(width) / Math.log(2)) % 1 !== 0)
      throw new Error(`ComputeTarget width of '${width}' is not a power of two`);
    this.width = width;
    this.targetAlpha = this.createTarget();
  }

  public compute(computeShader: ComputeShader, uniforms?: Uniforms) {
    const gl = getWebGLContext();
    gl.useProgram(computeShader.program);
    this.setBuffers(computeShader, getComputeBufferInfo());
    if (uniforms) this.setUniforms(computeShader, uniforms);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.viewport(0, 0, this.width, this.width);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return this;
  }

  public computeAsync(computeShader: ComputeShader, uniforms?: Uniforms): Promise<void> {
    return new Promise((resolve, reject) => {
      const gl = getWebGLContext() as WebGLRenderingContext;
      this.compute(computeShader, uniforms);
      if (!isWebGL2()) {
        gl.finish();
        resolve();
        return;
      } else {
        const gl2 = gl as WebGL2RenderingContext;
        const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (!sync) {
          reject(new Error("unable to create WebGLSync"));
          return;
        } else {
          const checkSync = () => {
            switch (gl2.clientWaitSync(sync, 0, 0)) {
              case gl2.ALREADY_SIGNALED:
                reject(new Error("clientWaitSync: ALREADY_SIGNALED"));
                return;
              case gl2.TIMEOUT_EXPIRED:
                requestAnimationFrame(() => checkSync());
                return;
              case gl2.CONDITION_SATISFIED:
                resolve();
                return;
              case gl2.WAIT_FAILED:
                reject(new Error("clientWaitSync: WAIT_FAILED"));
                return;
            }
          };
          requestAnimationFrame(() => checkSync());
        }
      }
    });
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

  public readPixels(out?: Uint8Array) {
    return this.readSomePixels(0, 0, this.width, this.width, out);
  }

  public readPixelsAsync(out: Uint8Array) {
    return this.readSomePixelsAsync(0, 0, this.width, this.width, out);
  }

  public readSomePixels(x: number, y: number, w: number, h: number, out?: Uint8Array) {
    if (!out) out = new Uint8Array(w * h * 4);
    const gl = getWebGLContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, out);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return out;
  }

  private readPixelsRecursively(
    x: number,
    y: number,
    w: number,
    h: number,
    limit: number,
    out: Uint8Array,
    done: () => void
  ) {
    const yStep = Math.min(Math.max(Math.floor(limit / w), 1), h);
    this.readSomePixels(x, y, w, yStep, out.subarray(0, 4 * w * yStep));
    if (h - yStep <= 0) return done();
    requestAnimationFrame(() =>
      this.readPixelsRecursively(x, y + yStep, w, h - yStep, limit, out.subarray(4 * w * yStep), done)
    );
  }

  private checkSyncRecursively(gl: WebGL2RenderingContext, sync: WebGLSync, callback: (err: Error | null) => void) {
    const syncv = gl.clientWaitSync(sync, 0, 0);
    switch (syncv) {
      case gl.ALREADY_SIGNALED:
        return callback(new Error("clientWaitSync: ALREADY_SIGNALED"));
      case gl.TIMEOUT_EXPIRED:
        requestAnimationFrame(() => this.checkSyncRecursively(gl, sync, callback));
        return;
      case gl.CONDITION_SATISFIED:
        return callback(null);
      case gl.WAIT_FAILED:
        return callback(new Error("clientWaitSync: WAIT_FAILED"));
    }
    return callback(new Error(`unexpected clientWaitSync: '${syncv}'`));
  }

  public readSomePixelsAsync(x: number, y: number, w: number, h: number, out?: Uint8Array): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (!out) out = new Uint8Array(w * h * 4);
      if (out.length !== w * h * 4) return reject(new Error(`out.length !== ${w * h * 4}`));
      if (!isWebGL2()) return this.readPixelsRecursively(x, y, w, h, 128 * 128, out, () => resolve(out));
      const gl = getWebGLContext() as WebGL2RenderingContext;
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buffer);
      gl.bufferData(gl.PIXEL_PACK_BUFFER, w * h * 4, gl.STATIC_DRAW);
      gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, 0);
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) return reject(new Error("unable to create WebGLSync"));
      this.checkSyncRecursively(gl, sync, (err: Error | null) => {
        if (err) return reject(err);
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buffer);
        gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, out as Uint8Array);
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
        return resolve(out);
      });
    });
  }

  public pushTextureData(bytes: Uint8Array) {
    const w = this.width;
    const n = bytes.length / 4;
    if (bytes.length > 4 * w * w) {
      throw new Error(`array length of: '${bytes.length}' overflows: '${4 * w * w}'`);
    } else if (bytes.length % 4 > 0) {
      throw new Error(`array length of: '${bytes.length}' is not a multiple of four`);
    }
    const gl = getWebGLContext();
    gl.bindTexture(gl.TEXTURE_2D, this.targetAlpha.texture);
    gl.texSubImage2D(
      gl.TEXTURE_2D,
      0,
      0,
      0,
      Math.min(n, w),
      Math.max(Math.floor(n / w), 1),
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      n > w ? bytes.subarray(0, (n - (n % w)) * 4) : bytes
    );
    if (n > w && 4 * w * w !== bytes.length) {
      gl.texSubImage2D(
        gl.TEXTURE_2D,
        0,
        0,
        Math.floor(n / this.width),
        n % this.width,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        bytes.subarray((n - (n % this.width)) * 4)
      );
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return this;
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

  public deleteBackBuffer() {
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

  private setUniforms(computeShader: ComputeShader, uniformValues: Uniforms) {
    const gl = getWebGLContext();
    let textureUnit = 0;
    let alreadySwapped = false;
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
          if (!alreadySwapped && this === value) {
            if (!this.targetBravo) this.targetBravo = this.createTarget();
            [this.targetAlpha, this.targetBravo] = [this.targetBravo, this.targetAlpha];
            alreadySwapped = true;
            gl.bindTexture(gl.TEXTURE_2D, this.targetBravo.texture);
          } else {
            gl.bindTexture(gl.TEXTURE_2D, (value as RenderTarget).targetAlpha.texture);
          }
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
