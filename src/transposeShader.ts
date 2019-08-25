import {
  createBufferInfoFromArrays,
  ProgramInfo,
  TransformFeedbackInfo,
  createUniformSetters,
  createAttributeSetters,
  createTransformFeedbackInfo,
  BufferInfo
} from "twgl.js";

import { getWebGLContext } from "./computeShader";
import { functionStrings } from "./functionStrings";

export const passThruTransposeVert = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_scatterCoord;
attribute vec2 a_position;
varying vec4 v_texCoord;

void main() {
  gl_PointSize = 1.0;
  gl_Position = vec4(a_position.xy, 0.0, 1.0);
  v_texCoord = texture2D(u_scatterCoord, (a_position.xy + vec2(1.0, 1.0)) / 2.0);
}`;

export const passThruTransposeFrag = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_sourceTex;
varying vec4 v_texCoord;

const float TEXTURE_WIDTH = 1.0;

float vec2ToUint16(vec2 v);
vec2 uint16ToVec2(float f);

void main() {
  vec2 fragCoord = vec2(vec2ToUint16(v_texCoord.rg) + 0.5, vec2ToUint16(v_texCoord.ba) + 0.5);
  gl_FragColor = texture2D(u_sourceTex, fragCoord.xy / TEXTURE_WIDTH);
}`;

const arrayOfBuffers = new Array(13) as BufferInfo[];

export function getTransposeBufferInfo(width: number) {
  if (width < 1 || width > 4096) throw new Error(`width of '${width}' is out of range (1 to 4096)`);
  const exponent = Math.log(width) / Math.log(2);
  if (exponent % 1 !== 0) throw new Error(`width of '${width}' is not a power of two`);
  if (!arrayOfBuffers[exponent]) {
    const width = Math.pow(2, exponent);
    const arr = new Float32Array(2 * width * width);
    var i = 0;
    for (var y = 0; y < width; y++) {
      for (var x = 0; x < width; x++) {
        arr[i++] = (2 * (x + 0.5)) / width - 1;
        arr[i++] = (2 * (y + 0.5)) / width - 1;
      }
    }
    const bufferInfo = createBufferInfoFromArrays(getWebGLContext(), {
      a_position: {
        data: arr,
        numComponents: 2
      }
    });
    arrayOfBuffers[exponent] = bufferInfo;
  }
  return arrayOfBuffers[exponent];
}

export class TransposeShader implements ProgramInfo {
  public readonly program: WebGLProgram;
  public readonly vertShader: WebGLShader;
  public readonly fragShader: WebGLShader;
  public readonly uniformSetters: { [key: string]: (...params: any[]) => any };
  public readonly attribSetters: { [key: string]: (...params: any[]) => any };
  public readonly transformFeedbackInfo?: { [key: string]: TransformFeedbackInfo };

  constructor(width: number) {
    const gl = getWebGLContext();
    const maxVertexTex = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    if (maxVertexTex < 2) {
      throw new Error(`MAX_VERTEX_TEXTURE_IMAGE_UNITS: '${maxVertexTex}' is less than 2`);
    }
    this.vertShader = this.createVertShader(width);
    this.fragShader = this.createFragShader(width);
    this.program = this.createProgram(this.vertShader, this.fragShader);
    this.uniformSetters = (createUniformSetters as any)(gl, this.program);
    this.attribSetters = (createAttributeSetters as any)(gl, this.program);
    this.transformFeedbackInfo = createTransformFeedbackInfo(gl, this.program);
  }

  public delete() {
    const gl = getWebGLContext();
    gl.deleteShader(this.vertShader);
    gl.deleteShader(this.fragShader);
    gl.deleteProgram(this.program);
  }

  private createVertShader(width: number) {
    const gl = getWebGLContext();
    const source = this.searchAndReplace(passThruTransposeVert, {
      "const float TEXTURE_WIDTH = 1.0;": `const float TEXTURE_WIDTH = ${width}.0;`,
      "float vec2ToUint16(vec2 v);": functionStrings.vec2ToUint16,
      "vec2 uint16ToVec2(float f);": functionStrings.uint16ToVec2
    });
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertShader) throw new Error("unable to create new vertex shader");
    gl.shaderSource(vertShader, source.trim());
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
      throw new Error(`could not compile vertex shader: ${gl.getShaderInfoLog(vertShader)}\n\n${source.trim()}`);
    return vertShader as WebGLShader;
  }

  private createFragShader(width: number) {
    const gl = getWebGLContext();
    const source = this.searchAndReplace(passThruTransposeFrag, {
      "const float TEXTURE_WIDTH = 1.0;": `const float TEXTURE_WIDTH = ${width}.0;`,
      "float vec2ToUint16(vec2 v);": functionStrings.vec2ToUint16,
      "vec2 uint16ToVec2(float f);": functionStrings.uint16ToVec2
    });
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragShader) throw new Error("unable to create new fragment shader");
    gl.shaderSource(fragShader, source.trim());
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
      throw new Error(`could not compile fragment shader: ${gl.getShaderInfoLog(fragShader)}\n\n${source.trim()}`);
    return fragShader as WebGLShader;
  }

  private createProgram(vertShader: WebGLShader, fragShader: WebGLShader) {
    const gl = getWebGLContext();
    var program = gl.createProgram();
    if (!program) throw new Error("unable to create program");
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`error in program linking: ${gl.getProgramInfoLog(program)}`);
      this.delete();
    }
    return program;
  }

  private searchAndReplace(s: string, vars?: { [name: string]: string }) {
    if (vars) {
      for (var [key, val] of Object.entries(vars)) {
        s = s.replace(key, val);
      }
    }
    return s;
  }
}
