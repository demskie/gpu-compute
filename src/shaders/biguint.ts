import * as basic from "./basic";
import { bytesToHex, hexToBytes } from "../bytes";
import { commonStutters } from "../functionStrings";
import { getDependencies, render, merge } from "../dependencies";

export function decodeUnsignedBytes(bytes: Uint8Array, bigEndian?: boolean) {
  if (bigEndian) bytes.reverse();
  return BigInt(`0x${bytesToHex(bytes)}`);
}

export function encodeUnsignedBytes(uint: bigint, bigEndian?: boolean) {
  if (uint < BigInt(0)) uint = BigInt(0);
  const bytes = hexToBytes(uint.toString(16));
  if (bigEndian) bytes.reverse();
  return bytes;
}

// prettier-ignore
export const dependencies = merge(
  basic.dependencies,
  getDependencies({
    biguintAdd: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintAdd.glsl"), "utf8"),
      declarations: [
        "void biguintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
        "void biguintAdd(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
      ]
    },
    biguintAnd: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintAnd.glsl"), "utf8"),
      declarations: [
        "void biguintAnd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"
      ]
    },
    biguintAssign: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintAssign.glsl"), "utf8"),
      declarations: [
        "void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);",
        "void biguintAssign(inout float [BYTE_COUNT], float);"
      ]
    },
    biguintAssignIfTrue: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintAssignIfTrue.glsl"), "utf8"),
      declarations: [
        "void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);",
        "void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], bool);",
        "void biguintAssignIfTrue(inout float [BYTE_COUNT], float, float);",
        "void biguintAssignIfTrue(inout float [BYTE_COUNT], float, bool);"
      ]
    },
    biguintDiv: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintDiv.glsl"), "utf8"),
      declarations: [
        "void biguintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
        "void biguintDiv(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
      ]
    },
    biguintEquals: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintEquals.glsl"), "utf8"),
      declarations: [
        "float biguintEquals(float [BYTE_COUNT], float [BYTE_COUNT]);",
        "float biguintEquals(float [BYTE_COUNT], float);"
      ]
    },
    biguintGreaterThan: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintGreaterThan.glsl"), "utf8"),
      declarations: [
        "float biguintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);",
        "float biguintGreaterThan(float [BYTE_COUNT], float);"
      ]
    },
    biguintGreaterThanOrEqual: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintGreaterThanOrEqual.glsl"), "utf8"),
      declarations: [
        "float biguintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);",
        "float biguintGreaterThanOrEqual(float [BYTE_COUNT], float);"
      ]
    },
    biguintLessThan: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintLessThan.glsl"), "utf8"),
      declarations: [
        "float biguintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);",
        "float biguintLessThan(float [BYTE_COUNT], float);"
      ]
    },
    biguintLessThanOrEqual: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintLessThanOrEqual.glsl"), "utf8"),
      declarations: [
        "float biguintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);",
        "float biguintLessThanOrEqual(float [BYTE_COUNT], float);"
      ]
    },
    biguintLshift: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintLshift.glsl"), "utf8"),
      declarations: [
        "void biguintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);"
      ]
    },
    biguintLshiftByOne: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintLshiftByOne.glsl"), "utf8"),
      declarations: [
        "void biguintLshiftByOne(inout float [BYTE_COUNT]);"
      ]
    },
    biguintLshiftByte: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintLshiftByte.glsl"), "utf8"),
      declarations: [
        "float biguintLshiftByte(float, float);"
      ]
    },
    biguintLshiftWord: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintLshiftWord.glsl"), "utf8"),
      declarations: [
        "void biguintLshiftWord(inout float [BYTE_COUNT], float);"
      ]
    },
    biguintMod: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintMod.glsl"), "utf8"),
      declarations: [
        "void biguintMod(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
        "void biguintMod(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
      ]
    },
    biguintMul: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintMul.glsl"), "utf8"),
      declarations: [
        "void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
        "void biguintMul(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
      ]
    },
    biguintOr: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintOr.glsl"), "utf8"),
      declarations: [
        "void biguintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"
      ]
    },
    biguintOrByte: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintOrByte.glsl"), "utf8"),
      declarations: [
        "float biguintOrByte(float, float);"
      ]
    },
    biguintPow: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintPow.glsl"), "utf8"),
      declarations: [
        "void biguintPow(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
      ]
    },
    biguintRshift: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintRshift.glsl"), "utf8"),
      declarations: [
        "void biguintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);"
      ]
    },
    biguintRshiftByOne: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintRshiftByOne.glsl"), "utf8"),
      declarations: [
        "void biguintRshiftByOne(inout float [BYTE_COUNT]);"
      ]
    },
    biguintRshiftByte: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintRshiftByte.glsl"), "utf8"),
      declarations: [
        "float biguintRshiftByte(float, float);"
      ]
    },
    biguintRshiftWord: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintRshiftWord.glsl"), "utf8"),
      declarations: [
        "void biguintRshiftWord(inout float [BYTE_COUNT], float);"
      ]
    },
    biguintSqrt: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintSqrt.glsl"), "utf8"),
      declarations: [
        "void biguintSqrt(float [BYTE_COUNT], inout float [BYTE_COUNT]);"
      ]
    },
    biguintSub: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintSub.glsl"), "utf8"),
      declarations: [
        "void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
        "void biguintSub(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
      ]
    },
    biguintXor: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/biguint/biguintXor.glsl"), "utf8"),
      declarations: [
        "void biguintXor(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"
      ]
    }
  })
);

export const rendered = render(dependencies, commonStutters);
