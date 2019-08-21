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
  try {
    const canvas = document.createElement("canvas");
    if (canvas) {
      const ctx = canvas.getContext("webgl");
      if (ctx) return (glctx = ctx);
      throw new Error("unable to get GL context from canvas");
    }
  } catch {
    glctx = require("gl")(1, 1) as WebGLRenderingContext;
  }
  if (!glctx) throw new Error("gl context could not be created");
  return glctx;
}

export const passThruVert = `
precision mediump float;
precision mediump int;
precision mediump sampler2D;
attribute vec3 position;
void main() {
	gl_Position = vec4(position, 1.0);
}`;

export const passThruFrag = `
precision mediump float;
precision mediump int;
precision mediump sampler2D;

uniform sampler2D u_tex;

const float TEXTURE_WIDTH = \${textureWidth};

void main() {
	gl_FragColor = texture2D(u_tex, gl_FragCoord.xy / TEXTURE_WIDTH);
}`;

export const defaultBufferInfo = createBufferInfoFromArrays(getWebGLContext(), {
  position: {
    data: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1],
    numComponents: 2
  }
});

export interface ShaderVariables {
  [name: string]: string;
}

export class ComputeShader implements ProgramInfo {
  public readonly program: WebGLProgram;
  public readonly vertShader: WebGLShader;
  public readonly fragShader: WebGLShader;
  public readonly uniformSetters: { [key: string]: (...params: any[]) => any };
  public readonly attribSetters: { [key: string]: (...params: any[]) => any };
  public readonly transformFeedbackInfo?: { [key: string]: TransformFeedbackInfo };

  constructor(fragShader: string, variables?: ShaderVariables, vertShader?: string) {
    const gl = getWebGLContext();
    this.vertShader = this.createVertShader(this.searchAndReplace(vertShader ? vertShader : passThruVert, variables));
    this.fragShader = this.createFragShader(this.searchAndReplace(fragShader, variables));
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

  private createVertShader(source: string) {
    const gl = getWebGLContext();
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertShader) throw new Error("unable to create new vertex shader");
    gl.shaderSource(vertShader, source);
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      throw new Error(`could not compile vertex shader: ${gl.getShaderInfoLog(vertShader)}`);
    }
    return vertShader as WebGLShader;
  }

  private createFragShader(source: string) {
    const gl = getWebGLContext();
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragShader) throw new Error("unable to create new vertex shader");
    gl.shaderSource(fragShader, source);
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      throw new Error(`could not compile fragment shader: ${gl.getShaderInfoLog(fragShader)}`);
    }
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
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
    }
    return program;
  }

  private searchAndReplace(s: string, vars?: ShaderVariables) {
    if (vars) {
      for (var [key, val] of Object.entries(vars)) {
        s = s.replace(key, val);
      }
    }
    return s;
  }
}
