import * as basic from "./basic";
import * as biguint from "./biguint";
import { commonStutters } from "../functionStrings";
import { getDependencies, render, merge } from "../dependencies";
import { removeTwosComplement, bytesToHex, hexToBytes, applyTwosComplement, resizeBytes } from "../bytes";

export function decodeSignedBytes(bytes: Uint8Array, bigEndian?: boolean) {
  const negative = removeTwosComplement(bytes);
  if (bigEndian) bytes.reverse();
  const n = BigInt(`0x${bytesToHex(bytes)}`) * (negative ? BigInt(-1) : BigInt(1));
  applyTwosComplement(bytes, negative);
  return n;
}

export function encodeSignedBytes(uint: bigint, bytesLength: number, bigEndian?: boolean) {
  const negative = uint < BigInt(0);
  if (negative) uint = uint * BigInt(-1);
  const bytes = resizeBytes(hexToBytes(uint.toString(16)), bytesLength, bigEndian);
  applyTwosComplement(bytes, negative);
  if (bigEndian) bytes.reverse();
  return bytes;
}

// prettier-ignore
export const dependencies = merge(
  basic.dependencies,
  biguint.dependencies,
  getDependencies({
    bigintAbs: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintAbs.glsl"), "utf8"),
      declarations: [
        "void bigintAbs(inout float [BYTE_COUNT]);"
      ],
    },
    bigintAdd: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintAdd.glsl"), "utf8"),
      declarations: [
        "void bigintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
        "void bigintAdd(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
      ],
    },
    bigintAnd: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintAnd.glsl"), "utf8"),
      declarations: [
        "void bigintAnd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"
      ],
    },
    bigintApplyTwosComplement: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintApplyTwosComplement.glsl"), "utf8"),
      declarations: [
        "void bigintApplyTwosComplement(inout float [BYTE_COUNT], float);",
        "void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);"
      ],
    },
    bigintAssign: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintAssign.glsl"), "utf8"),
      declarations: [
        "void bigintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);",
        "void bigintAssign(inout float [BYTE_COUNT], float);"
      ],
    },
    bigintAssignIfTrue: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintAssignIfTrue.glsl"), "utf8"),
      declarations: [
        "void bigintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);",
        "void bigintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], bool);",
        "void bigintAssignIfTrue(inout float [BYTE_COUNT], float, float);",
        "void bigintAssignIfTrue(inout float [BYTE_COUNT], float, bool);"
      ],
    },
    bigintDiv: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintDiv.glsl"), "utf8"),
      declarations: [
        "void bigintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
        "void bigintDiv(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
      ],
    },
    bigintEquals: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintEquals.glsl"), "utf8"),
      declarations: [
        "float bigintEquals(float [BYTE_COUNT], float [BYTE_COUNT]);",
        "float bigintEquals(float [BYTE_COUNT], float);"
      ],
    },
    bigintGreaterThan: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintGreaterThan.glsl"), "utf8"),
      declarations: [
        "float bigintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);",
        "float bigintGreaterThan(float [BYTE_COUNT], float);"
      ],
    },
    bigintGreaterThanOrEqual: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintGreaterThanOrEqual.glsl"), "utf8"),
      declarations: [
        "float bigintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);",
        "float bigintGreaterThanOrEqual(float [BYTE_COUNT], float);"
      ],
    },
    bigintLessThan: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintLessThan.glsl"), "utf8"),
      declarations: [
        "float bigintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);",
        "float bigintLessThan(float [BYTE_COUNT], float);"
      ],
    },
    bigintLessThanOrEqual: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintLessThanOrEqual.glsl"), "utf8"),
      declarations: [
        "float bigintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);",
        "float bigintLessThanOrEqual(float [BYTE_COUNT], float);"
      ],
    },
    bigintLshift: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintLshift.glsl"), "utf8"),
      declarations: [
        "void bigintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);"
      ],
    },
    bigintLshiftByOne: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintLshiftByOne.glsl"), "utf8"),
      declarations: [
        "void bigintLshiftByOne(inout float [BYTE_COUNT]);"
      ],
    },
    bigintMul: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintMul.glsl"), "utf8"),
      declarations: [
        "void bigintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
        "void bigintMul(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
      ],
    },
    bigintOr: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintOr.glsl"), "utf8"),
      declarations: [
        "void bigintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"
      ],
    },
    bigintRemoveTwosComplement: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintRemoveTwosComplement.glsl"), "utf8"),
      declarations: [
        "bool bigintRemoveTwosComplement(inout float [BYTE_COUNT]);"
      ],
    },
    bigintRshift: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintRshift.glsl"), "utf8"),
      declarations: [
        "void bigintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);"
      ],
    },
    bigintRshiftByOne: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintRshiftByOne.glsl"), "utf8"),
      declarations: [
        "void bigintRshiftByOne(inout float [BYTE_COUNT]);"
      ],
    },
    bigintSub: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintSub.glsl"), "utf8"),
      declarations: [
        "void bigintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
        "void bigintSub(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
      ],
    },
    bigintXor: {
      source: require("fs").readFileSync(require.resolve("../../src/shaders/bigint/bigintXor.glsl"), "utf8"),
      declarations: [
        "void bigintXor(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"
      ],
    }
  })
);

export const rendered = render(dependencies, commonStutters);
