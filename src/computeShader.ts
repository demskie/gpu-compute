import isNode from "detect-node";
import {
  createBufferInfoFromArrays,
  ProgramInfo,
  TransformFeedbackInfo,
  createUniformSetters,
  createAttributeSetters,
  createTransformFeedbackInfo
} from "twgl.js";

var glctx: WebGLRenderingContext | undefined;

export function getWebGLContext() {
  if (glctx) return glctx;
  if (!isNode) {
    const canvas = document.createElement("canvas");
    if (canvas) {
      const ctx = canvas.getContext("webgl");
      if (ctx) return (glctx = ctx);
    }
  }
  glctx = require("gl")(1, 1) as WebGLRenderingContext;
  if (!glctx) throw new Error("gl context could not be created");
  return glctx;
}

export const passThruVert = `
precision highp float;
precision highp int;
precision highp sampler2D;
attribute vec3 position;
void main() {
	gl_Position = vec4(position, 1.0);
}`;

export const defaultBufferInfo = createBufferInfoFromArrays(getWebGLContext(), {
  position: {
    data: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1],
    numComponents: 2
  }
});

export interface FragVariables {
  [name: string]: string;
}

export class ComputeShader implements ProgramInfo {
  public readonly program: WebGLProgram;
  public readonly uniformSetters: { [key: string]: (...params: any[]) => any };
  public readonly attribSetters: { [key: string]: (...params: any[]) => any };
  public readonly transformFeedbackInfo?: { [key: string]: TransformFeedbackInfo };

  constructor(fragShader: string, fragVariables?: FragVariables, vertShader?: string) {
    const gl = getWebGLContext();
    this.program = this.createProgram(
      vertShader ? vertShader : passThruVert,
      this.searchAndReplace(fragShader, fragVariables)
    );
    this.uniformSetters = createUniformSetters(this.program);
    this.attribSetters = createAttributeSetters(this.program);
    this.transformFeedbackInfo = createTransformFeedbackInfo(gl, this.program);
  }

  private createProgram(vertSource: string, fragSource: string) {
    const gl = getWebGLContext();
    var program = gl.createProgram();
    if (!program) throw new Error("unable to create program");
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertShader) throw new Error("unable to create new vertex shader");
    gl.shaderSource(vertShader, vertSource);
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      throw new Error(`could not compile vertex shader: ${gl.getShaderInfoLog(vertShader)}`);
    }
    gl.attachShader(program, vertShader);
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragShader) throw new Error("unable to create new vertex shader");
    gl.shaderSource(fragShader, fragSource);
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      throw new Error(`could not compile fragment shader: ${gl.getShaderInfoLog(fragShader)}`);
    }
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`error in program linking: ${gl.getProgramInfoLog(program)}`);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
    }
    return program;
  }

  private searchAndReplace(s: string, vars?: FragVariables) {
    if (vars) {
      for (var [key, val] of Object.entries(vars)) {
        s = s.replace("${" + key + "}", val);
      }
    }
    return s;
  }
}
