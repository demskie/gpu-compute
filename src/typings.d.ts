// resolving missing declarations from twgl.js library

/// <reference lib="es2017.sharedmemory" />

declare global {
  // type SharedArrayBuffer = any; // the above reference lib resolves this declaration
  type WebGLTransformFeedback = any;
  type WebGLVertexArrayObject = any;
  type WebGL2RenderingContext = any;
  type WebGLSampler = any;
}

// If your module exports nothing you need this line
export {};
