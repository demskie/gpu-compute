// eslint-disable-next-line @typescript-eslint/no-triple-slash-reference
/// <reference path="../types/webgl2.d.ts" />

import { setWebGLContext, getWebGLContext, isWebGL2 } from "./context";
import { ComputeShader, passThruFrag, passThruVert } from "./computeShader";
import { RenderTarget } from "./renderTarget";
import { packBooleans, unpackBooleans } from "./vectorBoolArray";
import { packInt16, unpackInt16, MIN_INT16, MAX_INT16 } from "./vectorInt16";
import { packUint16, unpackUint16, MIN_UINT16, MAX_UINT16 } from "./vectorUint16";
import { functionStrings } from "./functionStrings";

module.exports = {
  setWebGLContext,
  getWebGLContext,
  isWebGL2,
  ComputeShader,
  passThruFrag,
  passThruVert,
  RenderTarget,
  packBooleans,
  unpackBooleans,
  packInt16,
  unpackInt16,
  MIN_INT16,
  MAX_INT16,
  packUint16,
  unpackUint16,
  MIN_UINT16,
  MAX_UINT16,
  functionStrings
};

export { setWebGLContext, getWebGLContext, isWebGL2 } from "./context";
export { ComputeShader, passThruFrag, passThruVert } from "./computeShader";
export { RenderTarget } from "./renderTarget";
export { packBooleans, unpackBooleans } from "./vectorBoolArray";
export { packInt16, unpackInt16, MIN_INT16, MAX_INT16 } from "./vectorInt16";
export { packUint16, unpackUint16, MIN_UINT16, MAX_UINT16 } from "./vectorUint16";
export { functionStrings } from "./functionStrings";
