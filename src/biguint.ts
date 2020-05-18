import { bytesToHex, hexToBytes } from "./bytes";
import { renderDefinitions, replaceDefinitions, removeStutters } from "./dependencies";

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

export const functionStrings = {
  biguintAdd: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintAdd.glsl"), "utf8"), // prettier-ignore
  biguintAnd: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintAnd.glsl"), "utf8"), // prettier-ignore
  biguintAssign: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintAssign.glsl"), "utf8"), // prettier-ignore
  biguintAssignIfTrue: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintAssignIfTrue.glsl"), "utf8"), // prettier-ignore
  biguintDiv: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintDiv.glsl"), "utf8"), // prettier-ignore
  biguintEquals: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintEquals.glsl"), "utf8"), // prettier-ignore
  biguintGreaterThan: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintGreaterThan.glsl"), "utf8"), // prettier-ignore
  biguintGreaterThanOrEqual: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintGreaterThanOrEqual.glsl"), "utf8"), // prettier-ignore
  biguintLessThan: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintLessThan.glsl"), "utf8"), // prettier-ignore
  biguintLessThanOrEqual: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintLessThanOrEqual.glsl"), "utf8"), // prettier-ignore
  biguintLshift: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintLshift.glsl"), "utf8"), // prettier-ignore
  biguintLshiftByOne: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintLshiftByOne.glsl"), "utf8"), // prettier-ignore
  biguintLshiftByte: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintLshiftByte.glsl"), "utf8"), // prettier-ignore
  biguintLshiftWord: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintLshiftWord.glsl"), "utf8"), // prettier-ignore
  biguintMod: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintMod.glsl"), "utf8"), // prettier-ignore
  biguintMul: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintMul.glsl"), "utf8"), // prettier-ignore
  biguintOr: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintOr.glsl"), "utf8"), // prettier-ignore
  biguintOrByte: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintOrByte.glsl"), "utf8"), // prettier-ignore
  biguintPow: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintPow.glsl"), "utf8"), // prettier-ignore
  biguintRshift: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintRshift.glsl"), "utf8"), // prettier-ignore
  biguintRshiftByOne: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintRshiftByOne.glsl"), "utf8"), // prettier-ignore
  biguintRshiftByte: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintRshiftByte.glsl"), "utf8"), // prettier-ignore
  biguintRshiftWord: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintRshiftWord.glsl"), "utf8"), // prettier-ignore
  biguintSqrt: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintSqrt.glsl"), "utf8"), // prettier-ignore
  biguintSub: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintSub.glsl"), "utf8"), // prettier-ignore
  biguintXor: require("fs").readFileSync(require.resolve("./shaders/biguint/biguintXor.glsl"), "utf8") // prettier-ignore
};

Object.keys(functionStrings).forEach(key => {
  const x = functionStrings as { [key: string]: string };
  x[key] = x[key]
    .replace(/\r+/gm, "")
    .replace(/\t/g, "    ")
    .replace(/\n{3,}/g, "\n\n");
});

export const untouchedFunctionStrings = Object.assign({}, functionStrings);

export const declarations = {
  biguintAdd: {
    prepend: ["#ifndef BIG_UINT_ADD", "#define BIG_UINT_ADD"].join("\n"),
    declarations: [
      "void biguintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
      "void biguintAdd(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
    ],
    append: "#endif"
  },
  biguintAnd: {
    prepend: ["#ifndef BIG_UINT_AND", "#define BIG_UINT_AND"].join("\n"),
    declarations: ["void biguintAnd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  biguintAssign: {
    prepend: ["#ifndef BIG_UINT_ASSIGN", "#define BIG_UINT_ASSIGN"].join("\n"),
    declarations: [
      "void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);",
      "void biguintAssign(inout float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  biguintAssignIfTrue: {
    prepend: ["#ifndef BIG_UINT_ASSIGN_IF_TRUE", "#define BIG_UINT_ASSIGN_IF_TRUE"].join("\n"),
    declarations: [
      "void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);",
      "void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], bool);",
      "void biguintAssignIfTrue(inout float [BYTE_COUNT], float, float);",
      "void biguintAssignIfTrue(inout float [BYTE_COUNT], float, bool);"
    ],
    append: "#endif"
  },
  biguintDiv: {
    prepend: ["#ifndef BIG_UINT_DIV", "#define BIG_UINT_DIV"].join("\n"),
    declarations: [
      "void biguintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
      "void biguintDiv(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
    ],
    append: "#endif"
  },
  biguintEquals: {
    prepend: ["#ifndef BIG_UINT_EQUALS", "#define BIG_UINT_EQUALS"].join("\n"),
    declarations: [
      "float biguintEquals(float [BYTE_COUNT], float [BYTE_COUNT]);",
      "float biguintEquals(float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  biguintGreaterThan: {
    prepend: ["#ifndef BIG_UINT_GREATER_THAN", "#define BIG_UINT_GREATER_THAN"].join("\n"),
    declarations: [
      "float biguintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);",
      "float biguintGreaterThan(float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  biguintGreaterThanOrEqual: {
    prepend: ["#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL", "#define BIG_UINT_GREATER_THAN_OR_EQUAL"].join("\n"),
    declarations: [
      "float biguintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);",
      "float biguintGreaterThanOrEqual(float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  biguintLessThan: {
    prepend: ["#ifndef BIG_UINT_LESS_THAN", "#define BIG_UINT_LESS_THAN"].join("\n"),
    declarations: [
      "float biguintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);",
      "float biguintLessThan(float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  biguintLessThanOrEqual: {
    prepend: ["#ifndef BIG_UINT_LESS_THAN_OR_EQUAL", "#define BIG_UINT_LESS_THAN_OR_EQUAL"].join("\n"),
    declarations: [
      "float biguintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);",
      "float biguintLessThanOrEqual(float [BYTE_COUNT], float);"
    ],
    append: "#endif"
  },
  biguintLshift: {
    prepend: ["#ifndef BIG_UINT_LSHIFT", "#define BIG_UINT_LSHIFT"].join("\n"),
    declarations: ["void biguintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);"],
    append: "#endif"
  },
  biguintLshiftByOne: {
    prepend: ["#ifndef BIG_UINT_LSHIFT_BY_ONE", "#define BIG_UINT_LSHIFT_BY_ONE"].join("\n"),
    declarations: ["void biguintLshiftByOne(inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  biguintLshiftByte: {
    prepend: ["#ifndef BIG_UINT_LSHIFT_BYTE", "#define BIG_UINT_LSHIFT_BYTE"].join("\n"),
    declarations: ["float biguintLshiftByte(float, float);"],
    append: "#endif"
  },
  biguintLshiftWord: {
    prepend: ["#ifndef BIG_UINT_LSHIFT_WORD", "#define BIG_UINT_LSHIFT_WORD"].join("\n"),
    declarations: ["void biguintLshiftWord(inout float [BYTE_COUNT], float);"],
    append: "#endif"
  },
  biguintMod: {
    prepend: ["#ifndef BIG_UINT_MOD", "#define BIG_UINT_MOD"].join("\n"),
    declarations: [
      "void biguintMod(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
      "void biguintMod(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
    ],
    append: "#endif"
  },
  biguintMul: {
    prepend: ["#ifndef BIG_UINT_MUL", "#define BIG_UINT_MUL"].join("\n"),
    declarations: [
      "void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
      "void biguintMul(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
    ],
    append: "#endif"
  },
  biguintOr: {
    prepend: ["#ifndef BIG_UINT_OR", "#define BIG_UINT_OR"].join("\n"),
    declarations: ["void biguintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  biguintOrByte: {
    prepend: ["#ifndef BIG_UINT_OR_BYTE", "#define BIG_UINT_OR_BYTE"].join("\n"),
    declarations: ["float biguintOrByte(float, float);"],
    append: "#endif"
  },
  biguintPow: {
    prepend: ["#ifndef BIG_UINT_POW", "#define BIG_UINT_POW"].join("\n"),
    declarations: ["void biguintPow(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  biguintRshift: {
    prepend: ["#ifndef BIG_UINT_RSHIFT", "#define BIG_UINT_RSHIFT"].join("\n"),
    declarations: ["void biguintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);"],
    append: "#endif"
  },
  biguintRshiftByOne: {
    prepend: ["#ifndef BIG_UINT_RSHIFT_BY_ONE", "#define BIG_UINT_RSHIFT_BY_ONE"].join("\n"),
    declarations: ["void biguintRshiftByOne(inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  biguintRshiftByte: {
    prepend: ["#ifndef BIG_UINT_RSHIFT_BYTE", "#define BIG_UINT_RSHIFT_BYTE"].join("\n"),
    declarations: ["float biguintRshiftByte(float, float);"],
    append: "#endif"
  },
  biguintRshiftWord: {
    prepend: ["#ifndef BIG_UINT_RSHIFT_WORD", "#define BIG_UINT_RSHIFT_WORD"].join("\n"),
    declarations: ["void biguintRshiftWord(inout float [BYTE_COUNT], float);"],
    append: "#endif"
  },
  biguintSqrt: {
    prepend: ["#ifndef BIG_UINT_SQRT", "#define BIG_UINT_SQRT"].join("\n"),
    declarations: ["void biguintSqrt(float [BYTE_COUNT], inout float [BYTE_COUNT]);"],
    append: "#endif"
  },
  biguintSub: {
    prepend: ["#ifndef BIG_UINT_SUB", "#define BIG_UINT_SUB"].join("\n"),
    declarations: [
      "void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);",
      "void biguintSub(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);"
    ],
    append: "#endif"
  },
  biguintXor: {
    prepend: ["#ifndef BIG_UINT_XOR", "#define BIG_UINT_XOR"].join("\n"),
    declarations: ["void biguintXor(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);"],
    append: "#endif"
  }
};

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
