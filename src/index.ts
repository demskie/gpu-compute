/// <reference path="../types/twgl.d.ts" />
// resolving missing declarations from twgl.js library

import { ComputeShader, passThruFrag, passThruVert } from "./computeShader";
import { RenderTarget } from "./renderTarget";
import { packBooleans, unpackBooleans } from "./vectorBoolArray";
import { packInt16, unpackInt16, MIN_INT16, MAX_INT16 } from "./vectorInt16";
import { functionStrings } from "./functionStrings";

module.exports = {
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
  functionStrings
};

export default module.exports;

export { ComputeShader, passThruFrag, passThruVert } from "./computeShader";
export { RenderTarget } from "./renderTarget";
export { packBooleans, unpackBooleans } from "./vectorBoolArray";
export { packInt16, unpackInt16, MIN_INT16, MAX_INT16 } from "./vectorInt16";
export { functionStrings } from "./functionStrings";
