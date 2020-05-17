import { readFileSync } from "fs";
import * as biguint from "../biguint/biguint";
import { expandDefinitions } from "../../dependencies";
import { removeTwosComplement, bytesToHex, hexToBytes, applyTwosComplement } from "../../bytes";

export function decodeSignedBytes(bytes: Uint8Array, bigEndian?: boolean) {
  const negative = removeTwosComplement(bytes);
  if (bigEndian) bytes.reverse();
  return BigInt(`0x${bytesToHex(bytes)}`) * (negative ? BigInt(-1) : BigInt(1));
}

export function encodeSignedBytes(uint: bigint, bigEndian?: boolean) {
  const negative = uint < BigInt(0);
  if (negative) uint = uint * BigInt(-1);
  const bytes = hexToBytes(uint.toString(16));
  applyTwosComplement(bytes, negative);
  if (bigEndian) bytes.reverse();
  return bytes;
}

const read = (s: string) =>
  readFileSync(require.resolve(s), "utf8")
    .replace(/\r+/gm, "")
    .replace(/\t/g, "    ")
    .replace(/\n{3,}/g, "\n\n");

export const functionStrings = {
  bigintAbs: read("./bigintAbs.glsl"),
  bigintAdd: read("./bigintAdd.glsl"),
  bigintAnd: read("./bigintAnd.glsl"),
  bigintApplyTwosComplement: read("./bigintApplyTwosComplement.glsl"),
  bigintAssign: read("./bigintAssign.glsl"),
  bigintAssignIfTrue: read("./bigintAssignIfTrue.glsl"),
  bigintDiv: read("./bigintDiv.glsl"),
  bigintEquals: read("./bigintEquals.glsl"),
  bigintGreaterThan: read("./bigintGreaterThan.glsl"),
  bigintGreaterThanOrEqual: read("./bigintGreaterThanOrEqual.glsl"),
  bigintLessThan: read("./bigintLessThan.glsl"),
  bigintLessThanOrEqual: read("./bigintLessThanOrEqual.glsl"),
  bigintLshift: read("./bigintLshift.glsl"),
  bigintLshiftByOne: read("./bigintLshiftByOne.glsl"),
  bigintMul: read("./bigintMul.glsl"),
  bigintOr: read("./bigintOr.glsl"),
  bigintRemoveTwosComplement: read("./bigintRemoveTwosComplement.glsl"),
  bigintRshift: read("./bigintRshift.glsl"),
  bigintRshiftByOne: read("./bigintRshiftByOne.glsl"),
  bigintSub: read("./bigintSub.glsl"),
  bigintXor: read("./bigintXor.glsl")
};

Object.assign(functionStrings, biguint.untouchedFunctionStrings);

export const untouchedFunctionStrings = Object.assign({}, functionStrings);

export const declarations = {
  bigintAbs: {
    prepend: ["#ifndef BIG_INT_ABS", "#define BIG_INT_ABS"].join("\n"),
    declarations: ["void bigintAbs(inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  bigintAdd: {
    prepend: ["#ifndef BIG_INT_ADD", "#define BIG_INT_ADD"].join("\n"),
    declarations: [
      "void bigintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
      "void bigintAdd(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
    ],
    append: "#endif"
  },
  bigintAnd: {
    prepend: ["#ifndef BIG_INT_AND", "#define BIG_INT_AND"].join("\n"),
    declarations: ["void bigintAnd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  bigintApplyTwosComplement: {
    prepend: ["#ifndef BIG_INT_APPLY_TWOS_COMPLEMENT", "#define BIG_INT_APPLY_TWOS_COMPLEMENT"].join("\n"),
    declarations: [
      "void bigintApplyTwosComplement(inout float [BYTE_COUNT], float);",
      "void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);"
    ],
    append: "#endif"
  },
  bigintAssign: {
    prepend: ["#ifndef BIG_INT_ASSIGN", "#define BIG_INT_ASSIGN"].join("\n"),
    declarations: [
      "void bigintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);",
      "void bigintAssign(inout float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  bigintAssignIfTrue: {
    prepend: ["#ifndef BIG_INT_ASSIGN_IF_TRUE", "#define BIG_INT_ASSIGN_IF_TRUE"].join("\n"),
    declarations: [
      "void bigintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);",
      "void bigintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], bool);",
      "void bigintAssignIfTrue(inout float [BYTE_COUNT], float, float);",
      "void bigintAssignIfTrue(inout float [BYTE_COUNT], float, bool);"
    ],
    append: "#endif"
  },
  bigintDiv: {
    prepend: ["#ifndef BIG_INT_DIV", "#define BIG_INT_DIV"].join("\n"),
    declarations: [
      "void bigintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
      "void bigintDiv(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
    ],
    append: "#endif"
  },
  bigintEquals: {
    prepend: ["#ifndef BIG_INT_EQUALS", "#define BIG_INT_EQUALS"].join("\n"),
    declarations: [
      "float bigintEquals(float [BYTE_COUNT], float [BYTE_COUNT]);",
      "float bigintEquals(float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  bigintGreaterThan: {
    prepend: ["#ifndef BIG_INT_GREATER_THAN", "#define BIG_INT_GREATER_THAN"].join("\n"),
    declarations: [
      "float bigintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);",
      "float bigintGreaterThan(float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  bigintGreaterThanOrEqual: {
    prepend: ["#ifndef BIG_INT_GREATER_THAN_OR_EQUAL", "#define BIG_INT_GREATER_THAN_OR_EQUAL"].join("\n"),
    declarations: [
      "float bigintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);",
      "float bigintGreaterThanOrEqual(float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  bigintLessThan: {
    prepend: ["#ifndef BIG_INT_LESS_THAN", "#define BIG_INT_LESS_THAN"].join("\n"),
    declarations: [
      "float bigintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);",
      "float bigintLessThan(float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  bigintLessThanOrEqual: {
    prepend: ["#ifndef BIG_INT_LESS_THAN_OR_EQUAL", "#define BIG_INT_LESS_THAN_OR_EQUAL"].join("\n"),
    declarations: [
      "float bigintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);",
      "float bigintLessThanOrEqual(float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  bigintLshift: {
    prepend: ["#ifndef BIG_INT_LSHIFT", "#define BIG_INT_LSHIFT"].join("\n"),
    declarations: ["void bigintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);"],
    append: "#endif"
  },
  bigintLshiftByOne: {
    prepend: ["#ifndef BIG_INT_LSHIFT_BY_ONE", "#define BIG_INT_LSHIFT_BY_ONE"].join("\n"),
    declarations: ["void bigintLshiftByOne(inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  bigintMul: {
    prepend: ["#ifndef BIG_INT_MUL", "#define BIG_INT_MUL"].join("\n"),
    declarations: [
      "void bigintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
      "void bigintMul(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
    ],
    append: "#endif"
  },
  bigintOr: {
    prepend: ["#ifndef BIG_INT_OR", "#define BIG_INT_OR"].join("\n"),
    declarations: ["void bigintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  bigintRemoveTwosComplement: {
    prepend: ["#ifndef BIG_INT_REMOVE_TWOS_COMPLEMENT", "#define BIG_INT_REMOVE_TWOS_COMPLEMENT"].join("\n"),
    declarations: ["bool bigintRemoveTwosComplement(inout float[BYTE_COUNT]);"],
    append: "#endif"
  },
  bigintRshift: {
    prepend: ["#ifndef BIG_INT_RSHIFT", "#define BIG_INT_RSHIFT"].join("\n"),
    declarations: ["void bigintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);"],
    append: "#endif"
  },
  bigintRshiftByOne: {
    prepend: ["#ifndef BIG_INT_RSHIFT_BY_ONE", "#define BIG_INT_RSHIFT_BY_ONE"].join("\n"),
    declarations: ["void bigintRshiftByOne(inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  bigintSub: {
    prepend: ["#ifndef BIG_INT_SUB", "#define BIG_INT_SUB"].join("\n"),
    declarations: [
      "void bigintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
      "void bigintSub(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
    ],
    append: "#endif"
  },
  bigintXor: {
    prepend: ["#ifndef BIG_INT_XOR", "#define BIG_INT_XOR"].join("\n"),
    declarations: ["void bigintXor(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"],
    append: "#endif"
  }
};

Object.assign(declarations, biguint.declarations);

Object.assign(
  functionStrings,
  expandDefinitions(functionStrings, declarations, [
    [
      "#ifndef BYTE_COUNT",
      "#define BYTE_COUNT 16",
      "#endif",
      "",
      "#ifdef GL_ES",
      "precision highp float;",
      "precision highp int;",
      "#endif"
    ].join("\n")
  ])
);
