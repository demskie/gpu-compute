import { setWebGLContext, getWebGLContext, isWebGL2 } from "./context";
import { ComputeShader, passThruFrag, passThruVert } from "./computeShader";
import { RenderTarget } from "./renderTarget";
import { packBooleans, unpackBooleans } from "./vectorBoolArray";
import { packInt16, unpackInt16, MIN_INT16, MAX_INT16 } from "./vectorInt16";
import { packUint16, unpackUint16, MIN_UINT16, MAX_UINT16 } from "./vectorUint16";
import { functionStrings, replaceDependencies } from "./functionStrings";
import { decodeUnsignedBytes, encodeUnsignedBytes } from "./shaders/biguint";
import { decodeSignedBytes, encodeSignedBytes } from "./shaders/bigint";
import { getState, setState, resetState } from "./state";

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
  functionStrings,
  replaceDependencies,
  decodeUnsignedBytes,
  encodeUnsignedBytes,
  decodeSignedBytes,
  encodeSignedBytes,
  getState,
  setState,
  resetState
};

export { setWebGLContext, getWebGLContext, isWebGL2 } from "./context";
export { ComputeShader, passThruFrag, passThruVert } from "./computeShader";
export { RenderTarget } from "./renderTarget";
export { packBooleans, unpackBooleans } from "./vectorBoolArray";
export { packInt16, unpackInt16, MIN_INT16, MAX_INT16 } from "./vectorInt16";
export { packUint16, unpackUint16, MIN_UINT16, MAX_UINT16 } from "./vectorUint16";
export { functionStrings, replaceDependencies } from "./functionStrings";
export { decodeUnsignedBytes, encodeUnsignedBytes } from "./shaders/biguint";
export { decodeSignedBytes, encodeSignedBytes } from "./shaders/bigint";
export { getState, setState, resetState } from "./state";
