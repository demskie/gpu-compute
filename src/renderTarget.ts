import { setWebGLContext, getWebGLContext, getMaxRenderBufferSize } from "./context";
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

  constructor(width: number, ctx?: WebGLRenderingContext) {
    if (ctx) setWebGLContext(ctx);
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
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.useProgram(computeShader.program);
    this.setBuffers(computeShader, getComputeBufferInfo());
    if (uniforms) this.setUniforms(computeShader, uniforms);
    gl.viewport(0, 0, this.width, this.width);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return this;
  }

  public transpose(scatterFragCoord: RenderTarget) {
    if (scatterFragCoord.width !== this.width)
      throw new Error(`scatterFragCoord width: '${scatterFragCoord.width}' != RenderTarget width: '${this.width}'`);
    const gl = getWebGLContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    const shader = getTransposeShader();
    gl.useProgram(shader.program);
    this.setBuffers(shader, getTransposeBufferInfo(this.width));
    this.setUniforms(shader, {
      u_scatterCoord: scatterFragCoord,
      u_sourceTex: this,
      u_textureWidth: this.width
    });
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

  public readSomePixels(startX: number, startY: number, stopX?: number, stopY?: number, output?: Uint8Array) {
    stopX = stopX ? stopX : this.width;
    stopY = stopY ? stopY : this.width;
    if (!output) output = new Uint8Array((stopX - startX) * (stopY - startY) * 4);
    const gl = getWebGLContext();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetAlpha.framebuffer);
    gl.readPixels(startX, startY, stopX, stopY, gl.RGBA, gl.UNSIGNED_BYTE, output);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return output;
  }

  public pushTextureData(bytes: Uint8Array) {
    const difference = 4 * (this.width * this.width) - bytes.length;
    if (difference < 0) {
      throw new Error(`array length of: '${bytes.length}' overflows: '${4 * (this.width * this.width)}'`);
    } else if (difference % 4 !== 0) {
      throw new Error(`array length of: '${bytes.length}' is not a multiple of four`);
    }
    const gl = getWebGLContext();
    gl.bindTexture(gl.TEXTURE_2D, this.targetAlpha.texture);
    if (difference === 0) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.width, 0, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
    } else {
      const width = Math.min(bytes.length / 4, this.width);
      const height = Math.ceil(bytes.length / 4 / this.width);
      if (width === this.width && (bytes.length / 4) % this.width !== 0) {
        bytes = new Uint8Array(arrayBufferTransfer(bytes.buffer, 4 * width * height));
      }
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
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
      const index = computeShader.attributeInfo[attrName]["location"] as number;
      const size = computeShader.attributeInfo[attrName]["size"];
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0);
    }
  }

  private setUniforms(computeShader: ComputeShader, uniforms: Uniforms) {
    const gl = getWebGLContext();
    let textureIndex = gl.TEXTURE0;
    const processedUniforms = uniforms ? this.processUniforms(uniforms) : {};
    for (let uniformName in computeShader.uniformInfo) {
      const value = processedUniforms[uniformName];
      const type = computeShader.uniformInfo[uniformName]["type"];
      const size = computeShader.uniformInfo[uniformName]["size"];
      const location = computeShader.uniformInfo[uniformName]["location"];
      switch (type) {
        case gl.SAMPLER_2D:
          if (Array.isArray(value) || typeof value === "number")
            throw new Error(`provided uniform: '${uniformName}' is not a WebGLTexture`);
          gl.uniform1i(location, textureIndex);
          gl.activeTexture(textureIndex);
          gl.bindTexture(gl.TEXTURE_2D, value);
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

  private processUniforms(uniforms: Uniforms): { [key: string]: number | WebGLTexture | Int32Array | Float32Array } {
    let swapped = false;
    const unis = {} as { [key: string]: any };
    for (var [uniformName, data] of Object.entries(uniforms)) {
      if (!data) continue;
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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer

function arrayBufferTransfer(source: ArrayBuffer, length: number) {
  if ((ArrayBuffer as any).transfer) return (ArrayBuffer as any).transfer(source, length) as ArrayBuffer;
  if (!(source instanceof ArrayBuffer)) throw new TypeError("Source must be an instance of ArrayBuffer");
  if (length <= source.byteLength) return source.slice(0, length);
  let sourceView = new Uint8Array(source);
  let destView = new Uint8Array(new ArrayBuffer(length));
  destView.set(sourceView);
  return destView.buffer;
}
