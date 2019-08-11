/// <reference lib="es2017.sharedmemory" />

declare global {
  // <reference lib="es2017.sharedmemory" resolves this declaration
  // type SharedArrayBuffer = any;
  //
  // devDependency: "@types/webgl2" resolves the following declarations
  // type WebGLTransformFeedback = any;
  // type WebGLVertexArrayObject = any;
  // type WebGL2RenderingContext = any;
  // type WebGLSampler = any;
}

// If your module exports nothing you need this line
export {};
