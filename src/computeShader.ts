import isNode from "detect-node";
import { createBufferInfoFromArrays, ProgramInfo, TransformFeedbackInfo, createProgramInfo } from "twgl.js";

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
    fragShader = this.searchAndReplace(fragShader, fragVariables);
    const prog = createProgramInfo(getWebGLContext(), [vertShader ? vertShader : passThruVert, fragShader]);
    this.program = prog.program;
    this.uniformSetters = prog.uniformSetters;
    this.attribSetters = prog.attribSetters;
    this.transformFeedbackInfo = prog.transformFeedbackInfo;
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
