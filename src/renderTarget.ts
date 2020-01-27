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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  public computeAsync(computeShader: ComputeShader, uniforms?: Uniforms) {
    return new Promise((resolve, reject) => {
      const gl = getWebGLContext() as WebGL2RenderingContext;
      this.compute(computeShader, uniforms);
      if (!isWebGL2()) {
        gl.finish();
        resolve();
      } else {
        const gl2 = gl as WebGL2RenderingContext;
        const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (!sync) {
          reject(new Error("unable to create WebGLSync"));
        } else {
          const checkSync = () => {
            switch (gl2.clientWaitSync(sync, 0, 0)) {
              case gl2.ALREADY_SIGNALED:
                reject(new Error("clientWaitSync: ALREADY_SIGNALED"));
                break;
              case gl2.TIMEOUT_EXPIRED:
                requestAnimationFrame(() => checkSync());
                break;
              case gl2.CONDITION_SATISFIED:
                resolve();
                break;
              case gl2.WAIT_FAILED:
                reject(new Error("clientWaitSync: WAIT_FAILED"));
                break;
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

  public readPixels(output?: Uint8Array) {
    if (!output) output = new Uint8Array(this.width * this.width * 4);
    const gl = getWebGLContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.readPixels(0, 0, this.width, this.width, gl.RGBA, gl.UNSIGNED_BYTE, output);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return output;
  }

  public readSomePixels(x: number, y: number, width: number, height: number, output?: Uint8Array) {
    if (!output) output = new Uint8Array(width * height * 4);
    const gl = getWebGLContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, output);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return output;
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
