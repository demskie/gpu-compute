var glctx: WebGLRenderingContext | undefined;

export function setWebGLContext(ctx: WebGLRenderingContext) {
  return (glctx = ctx ? ctx : getWebGLContext());
}

export function getWebGLContext() {
  if (!glctx) {
    try {
      const canvas = document.createElement("canvas");
      if (!canvas) throw new Error("unable to create canvas");
      const gl = canvas.getContext("webgl");
      if (!gl) throw new Error("unable to get context");
      glctx = gl;
    } catch {
      throw new Error("unable to get GL context from canvas");
    }
  }
  return glctx;
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
