import * as biguint from "./biguint";
import { renderDefinitions, replaceDefinitions, removeStutters } from "./dependencies";
import { removeTwosComplement, bytesToHex, hexToBytes, applyTwosComplement, resizeBytes } from "./bytes";

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

export const functionStrings = {
  bigintAbs: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintAbs.glsl"), "utf8"), // prettier-ignore
  bigintAdd: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintAdd.glsl"), "utf8"), // prettier-ignore
  bigintAnd: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintAnd.glsl"), "utf8"), // prettier-ignore
  bigintApplyTwosComplement: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintApplyTwosComplement.glsl"),"utf8"), // prettier-ignore
  bigintAssign: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintAssign.glsl"), "utf8"), // prettier-ignore
  bigintAssignIfTrue: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintAssignIfTrue.glsl"), "utf8"), // prettier-ignore
  bigintDiv: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintDiv.glsl"), "utf8"), // prettier-ignore
  bigintEquals: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintEquals.glsl"), "utf8"), // prettier-ignore
  bigintGreaterThan: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintGreaterThan.glsl"), "utf8"), // prettier-ignore
  bigintGreaterThanOrEqual: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintGreaterThanOrEqual.glsl"), "utf8"), // prettier-ignore
  bigintLessThan: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintLessThan.glsl"), "utf8"), // prettier-ignore
  bigintLessThanOrEqual: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintLessThanOrEqual.glsl"), "utf8"), // prettier-ignore
  bigintLshift: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintLshift.glsl"), "utf8"), // prettier-ignore
  bigintLshiftByOne: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintLshiftByOne.glsl"), "utf8"), // prettier-ignore
  bigintMul: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintMul.glsl"), "utf8"), // prettier-ignore
  bigintOr: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintOr.glsl"), "utf8"), // prettier-ignore
  bigintRemoveTwosComplement: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintRemoveTwosComplement.glsl"), "utf8"), // prettier-ignore
  bigintRshift: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintRshift.glsl"), "utf8"), // prettier-ignore
  bigintRshiftByOne: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintRshiftByOne.glsl"), "utf8"), // prettier-ignore
  bigintSub: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintSub.glsl"), "utf8"), // prettier-ignore
  bigintXor: require("fs").readFileSync(require.resolve("./shaders/bigint/bigintXor.glsl"), "utf8") // prettier-ignore
};

Object.keys(functionStrings).forEach(key => {
  const x = functionStrings as { [key: string]: string };
  x[key] = x[key]
    .replace(/\r+/gm, "")
    .replace(/\t/g, "    ")
    .replace(/\n{3,}/g, "\n\n");
});

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
    declarations: ["bool bigintRemoveTwosComplement(inout float [BYTE_COUNT]);"],
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

const stutters = [
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
];

Object.assign(functionStrings, renderDefinitions(functionStrings, declarations, stutters));

export function expandDefinitions(s: string) {
  s = replaceDefinitions(s, functionStrings, declarations);
  return removeStutters(s, stutters).replace(/\n{3,}/g, "\n\n");
}
