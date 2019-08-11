import isNode from "detect-node";
import {
  createBufferInfoFromArrays,
  ProgramInfo,
  TransformFeedbackInfo,
  createProgramFromSources,
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
    const sources = [vertShader ? vertShader : passThruVert, this.searchAndReplace(fragShader, fragVariables)];
    const errorCallback = (err: string) => {
      throw new Error(err);
    };
    this.program = createProgramFromSources(gl, sources, errorCallback);
    this.uniformSetters = createUniformSetters(this.program);
    this.attribSetters = createAttributeSetters(this.program);
    this.transformFeedbackInfo = createTransformFeedbackInfo(gl, this.program);
  }

  private compile(s: string, shaderType: number) {
    const gl = getWebGLContext();
    var shader = gl.createShader(shaderType);
    if (!shader) throw new Error("unable to create new shader");
    gl.shaderSource(shader, s);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error("could not compile shader:" + gl.getShaderInfoLog(shader));
    }
    return shader;
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
