import { setBuffersAndAttributes, setUniforms } from "twgl.js";
import { ComputeShader, getWebGLContext, defaultBufferInfo } from "./computeShader";

export interface Uniforms {
  [key: string]: RenderTarget | number | Int32Array | Float32Array;
}

export class RenderTarget {
  public readonly width: number;
  private targetAlpha: { framebuffer: WebGLFramebuffer; texture: WebGLTexture };
  private targetBravo?: { framebuffer: WebGLFramebuffer; texture: WebGLTexture };

  constructor(width: number) {
    if (!Number.isInteger(width) || width < 1 || width > 4096)
      throw new Error(`ComputeTarget width of '${width}' is out of range (1 to 4096)`);
    if ((Math.log(width) / Math.log(2)) % 1 !== 0)
      throw new Error(`ComputeTarget width of '${width}' is not a power of two`);
    this.width = width;
    this.targetAlpha = this.createTarget();
  }

  public compute(computeShader: ComputeShader, uniforms?: Uniforms) {
    const processedUniforms = uniforms ? this.processUniforms(uniforms) : {};
    const gl = getWebGLContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.useProgram(computeShader.program);
    setBuffersAndAttributes(gl, computeShader, defaultBufferInfo);
    setUniforms(computeShader, processedUniforms);
    gl.viewport(0, 0, this.width, this.width);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
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

  public readSomePixels(startX: number, startY: number, stopX?: number, stopY?: number, output?: Uint8Array) {
    stopX = stopX ? stopX : this.width;
    stopY = stopY ? stopY : this.width;
    if (!output) output = new Uint8Array(stopX - startX * stopY - startY * 4);
    const gl = getWebGLContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.readPixels(startX, startY, stopX, stopY, gl.RGBA, gl.UNSIGNED_BYTE, output);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return output;
  }

  public pushTextureData(bytes: Uint8Array) {
    const gl = getWebGLContext();
    gl.bindTexture(gl.TEXTURE_2D, this.targetAlpha.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.width, 0, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return this;
  }

  private processUniforms(uniforms: Uniforms): { [key: string]: number | WebGLTexture | Int32Array | Float32Array } {
    let swapped = false;
    const unis = {} as { [key: string]: any };
    for (var [uniformName, data] of Object.entries(uniforms)) {
      switch (data.constructor) {
        case RenderTarget:
          if (data === this) {
            if (!swapped) {
              const x = this.targetAlpha;
              this.targetAlpha = this.targetBravo ? this.targetBravo : this.createTarget();
              this.targetBravo = x;
            }
            swapped = true;
            unis[uniformName] = (this.targetBravo as { texture: WebGLTexture }).texture;
          } else {
            unis[uniformName] = (data as RenderTarget).targetAlpha.texture;
          }
          break;
        case Number:
        case Int32Array:
        case Float32Array:
          unis[uniformName] = data;
          break;
      }
    }
    return unis;
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
