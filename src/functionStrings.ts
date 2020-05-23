import * as basic from "./shaders/basic";
import * as bigint from "./shaders/bigint";
import * as biguint from "./shaders/biguint";
import { render, replace, merge } from "./dependencies";

export const commonStutters = [
  /^[ \t]*#ifndef[ \t]+BYTE_COUNT[ \t]*\n[ \t]*#define[ \t]+BYTE_COUNT[ \t]+16[ \t]*\n[ \t]*#endif[ \t]*/gm,
  /^[ \t]*#ifdef[ \t]+GL_ES[ \t]*\n[ \t]*precision[ \t]+highp[ \t]+float;[ \t]*\n[ \t]*precision[ \t]+highp[ \t]+int;[ \t]*\n[ \t]*#endif[ \t]*/gm
];

export function replaceDependencies(s: string) {
  return replace(s, merge(basic.dependencies, bigint.dependencies, biguint.dependencies), commonStutters);
}

export const rendered = render(basic.dependencies, commonStutters);

export const functionStrings = {
  eq: rendered["eq"],
  gt: rendered["gt"],
  gte: rendered["gte"],
  int16FromVec2: rendered["int16FromVec2"],
  int16ToVec2: rendered["int16ToVec2"],
  lt: rendered["lt"],
  lte: rendered["lte"],
  neq: rendered["neq"],
  packBooleans: rendered["packBooleans"],
  round: rendered["round"],
  uint16FromVec2: rendered["uint16FromVec2"],
  uint16ToVec2: rendered["uint16ToVec2"],
  unpackBooleans: rendered["unpackBooleans"],
  bigintAbs: bigint.rendered["bigintAbs"],
  bigintAdd: bigint.rendered["bigintAdd"],
  bigintAnd: bigint.rendered["bigintAnd"],
  bigintApplyTwosComplement: bigint.rendered["bigintApplyTwosComplement"],
  bigintAssign: bigint.rendered["bigintAssign"],
  bigintAssignIfTrue: bigint.rendered["bigintAssignIfTrue"],
  bigintDiv: bigint.rendered["bigintDiv"],
  bigintEquals: bigint.rendered["bigintEquals"],
  bigintGreaterThan: bigint.rendered["bigintGreaterThan"],
  bigintGreaterThanOrEqual: bigint.rendered["bigintGreaterThanOrEqual"],
  bigintLessThan: bigint.rendered["bigintLessThan"],
  bigintLessThanOrEqual: bigint.rendered["bigintLessThanOrEqual"],
  bigintLshift: bigint.rendered["bigintLshift"],
  bigintLshiftByOne: bigint.rendered["bigintLshiftByOne"],
  bigintMul: bigint.rendered["bigintMul"],
  bigintOr: bigint.rendered["bigintOr"],
  bigintRemoveTwosComplement: bigint.rendered["bigintRemoveTwosComplement"],
  bigintRshift: bigint.rendered["bigintRshift"],
  bigintRshiftByOne: bigint.rendered["bigintRshiftByOne"],
  bigintSub: bigint.rendered["bigintSub"],
  bigintXor: bigint.rendered["bigintXor"],
  biguintAdd: biguint.rendered["biguintAdd"],
  biguintAnd: biguint.rendered["biguintAnd"],
  biguintAssign: biguint.rendered["biguintAssign"],
  biguintAssignIfTrue: biguint.rendered["biguintAssignIfTrue"],
  biguintDiv: biguint.rendered["biguintDiv"],
  biguintEquals: biguint.rendered["biguintEquals"],
  biguintGreaterThan: biguint.rendered["biguintGreaterThan"],
  biguintGreaterThanOrEqual: biguint.rendered["biguintGreaterThanOrEqual"],
  biguintLessThan: biguint.rendered["biguintLessThan"],
  biguintLessThanOrEqual: biguint.rendered["biguintLessThanOrEqual"],
  biguintLshift: biguint.rendered["biguintLshift"],
  biguintLshiftByOne: biguint.rendered["biguintLshiftByOne"],
  biguintLshiftByte: biguint.rendered["biguintLshiftByte"],
  biguintLshiftWord: biguint.rendered["biguintLshiftWord"],
  biguintMod: biguint.rendered["biguintMod"],
  biguintMul: biguint.rendered["biguintMul"],
  biguintOr: biguint.rendered["biguintOr"],
  biguintOrByte: biguint.rendered["biguintOrByte"],
  biguintPow: biguint.rendered["biguintPow"],
  biguintRshift: biguint.rendered["biguintRshift"],
  biguintRshiftByOne: biguint.rendered["biguintRshiftByOne"],
  biguintRshiftByte: biguint.rendered["biguintRshiftByte"],
  biguintRshiftWord: biguint.rendered["biguintRshiftWord"],
  biguintSqrt: biguint.rendered["biguintSqrt"],
  biguintSub: biguint.rendered["biguintSub"],
  biguintXor: biguint.rendered["biguintXor"]
};
