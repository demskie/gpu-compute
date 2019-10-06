var glctx: WebGLRenderingContext | WebGL2RenderingContext | undefined;

export function setWebGLContext(ctx: WebGLRenderingContext | WebGL2RenderingContext) {
  return (glctx = ctx ? ctx : getWebGLContext()) as WebGLRenderingContext | WebGL2RenderingContext;
}

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

export function isWebGL2() {
  return typeof WebGL2RenderingContext !== "undefined" && getWebGLContext() instanceof WebGL2RenderingContext;
}

var maxRenderBufferSize = 0;

export function getMaxRenderBufferSize() {
  if (!maxRenderBufferSize) {
    const gl = getWebGLContext();
    maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    console.debug(`MAX_RENDERBUFFER_SIZE: '${maxRenderBufferSize}'`);
  }
  return maxRenderBufferSize;
}
