import { setWebGLContext, getWebGLContext } from "./context";
import { unroll } from "./unroll";

export const passThruVert = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

attribute vec3 a_position;

void main() {
  gl_Position = vec4(a_position, 1.0);
}`;

export const passThruFrag = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_tex;
uniform float u_textureWidth;

void main() {
  gl_FragColor = texture2D(u_tex, gl_FragCoord.xy / u_textureWidth);
}`;

export interface ShaderVariables {
  [name: string]: string;
}

export interface ProgramInfo {
  [name: string]: {
    size: number;
    type: number;
    location: WebGLUniformLocation | number;
  };
}

export class ComputeShader {
  readonly program: WebGLProgram;
  readonly vertShader: WebGLShader;
  readonly fragShader: WebGLShader;
  readonly attributeInfo: ProgramInfo;
  readonly uniformInfo: ProgramInfo;

  constructor(fs: string, vars?: ShaderVariables, vs?: string, ctx?: WebGLRenderingContext | WebGL2RenderingContext) {
    ctx = (ctx ? setWebGLContext(ctx) : getWebGLContext()) as WebGLRenderingContext | WebGL2RenderingContext;
    this.vertShader = this.createVertShader(this.searchAndReplace(vs ? vs : passThruVert, vars));
    this.fragShader = this.createFragShader(this.searchAndReplace(fs, vars));
    this.program = this.createProgram(this.vertShader, this.fragShader);
    this.attributeInfo = this.getAttributeInfo(ctx, this.program);
    this.uniformInfo = this.getUniformInfo(ctx, this.program);
  }

  delete() {
    const gl = getWebGLContext();
    gl.deleteShader(this.vertShader);
    gl.deleteShader(this.fragShader);
    gl.deleteProgram(this.program);
  }

  private preprocess(source: string) {
    return source;
    // source = source.replace("\t", "    ");
    // source = source.replace(/(\n\s*?\n)\s*\n/, "$1");
    // return unroll(source.trim());
  }

  private createVertShader(source: string) {
    const gl = getWebGLContext();
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertShader) throw new Error("unable to create new vertex shader");
    gl.shaderSource(vertShader, this.preprocess(source));
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
      throw new Error(`could not compile vertex shader: ${gl.getShaderInfoLog(vertShader)}\n\n${source.trim()}`);
    return vertShader as WebGLShader;
  }

  private createFragShader(source: string) {
    const gl = getWebGLContext();
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragShader) throw new Error("unable to create new fragment shader");
    gl.shaderSource(fragShader, this.preprocess(source));
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
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(`error in program linking: ${gl.getProgramInfoLog(program)}`);
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

  private getAttributeInfo(gl: WebGLRenderingContext, program: WebGLProgram) {
    const attributeInfo = {} as ProgramInfo;
    const cnt = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) as number;
    for (let idx = 0; idx < cnt; idx++) {
      const activeInfo = gl.getActiveAttrib(program, idx);
      if (activeInfo === null) continue;
      const location = gl.getAttribLocation(program, activeInfo.name);
      if (location === null) continue;
      attributeInfo[activeInfo.name] = {
        size: activeInfo.size,
        type: activeInfo.type,
        location: location
      };
    }
    return attributeInfo;
  }

  private getUniformInfo(gl: WebGLRenderingContext, program: WebGLProgram) {
    const uniformInfo = {} as ProgramInfo;
    const cnt = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let idx = 0; idx < cnt; idx++) {
      const activeInfo = gl.getActiveUniform(program, idx);
      if (activeInfo === null) continue;
      const location = gl.getUniformLocation(program, activeInfo.name);
      if (location === null) continue;
      uniformInfo[activeInfo.name] = {
        size: activeInfo.size,
        type: activeInfo.type,
        location: location
      };
    }
    return uniformInfo;
  }
}
