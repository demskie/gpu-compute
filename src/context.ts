var glctx: WebGLRenderingContext | WebGL2RenderingContext | undefined;

export function getWebGLContext() {
  if (!glctx) {
    try {
      const canvas = document.createElement("canvas");
      if (!canvas) throw new Error("unable to create canvas");
      const gl2 = canvas.getContext("webgl2");
      if (gl2 && typeof WebGL2RenderingContext !== "undefined") {
        console.debug("your browser supports WebGL2");
        glctx = gl2;
      } else {
        console.debug("your browser doesn't support WebGL2");
        const gl = canvas.getContext("webgl");
        if (!gl) throw new Error("unable to get context");
        glctx = gl;
      }
    } catch {
      throw new Error("unable to get WebGL context from canvas");
    }
  }
  return glctx;
}

export function setWebGLContext(ctx: WebGLRenderingContext | WebGL2RenderingContext) {
  return (glctx = ctx ? ctx : getWebGLContext()) as WebGLRenderingContext | WebGL2RenderingContext;
}

export function isWebGL2() {
  return typeof WebGL2RenderingContext !== "undefined" && getWebGLContext() instanceof WebGL2RenderingContext;
}

var maxRenderBufferSize: undefined | number;
var sharedVAOExtension: undefined | OES_vertex_array_object | null;
var sharedInstanceExtension: undefined | ANGLE_instanced_arrays | null;
var maxVertexAttribs: undefined | number;
var maxCombinedTextureImageUnits: undefined | number;

export function getMaxRenderBufferSize() {
  if (maxRenderBufferSize === undefined) {
    const gl = getWebGLContext();
    maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) as number;
  }
  return maxRenderBufferSize;
}

export function getVAOExtension() {
  if (sharedVAOExtension === undefined) {
    const gl = getWebGLContext();
    sharedVAOExtension = gl.getExtension("OES_vertex_array_object");
  }
  return sharedVAOExtension;
}

export function getInstanceExtension() {
  if (sharedInstanceExtension === undefined) {
    const gl = getWebGLContext();
    sharedInstanceExtension = gl.getExtension("ANGLE_instanced_arrays");
  }
  return sharedInstanceExtension;
}

export function getMaxVertexAttribs() {
  if (maxVertexAttribs === undefined) {
    const gl = getWebGLContext();
    maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) as number;
  }
  return maxVertexAttribs;
}

export function getCombinedTextureImageUnits() {
  if (maxCombinedTextureImageUnits === undefined) {
    const gl = getWebGLContext();
    maxCombinedTextureImageUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) as number;
  }
  return maxCombinedTextureImageUnits;
}
