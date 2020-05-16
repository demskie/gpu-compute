import { readFileSync } from "fs";
import { bytesToHex, hexToBytes } from "../../bytes";

export function bytesToUint64(bytes: Uint8Array) {
  let n = 0;
  for (let i = 0; i < 6; i++) {
    n += bytes[i] * Math.pow(2, i * 8);
  }
  return n;
}

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

export function uint64ToBytes(n: number) {
  const bytes = new Uint8Array(16);
  for (let i = 5; i >= 0; i--) {
    bytes[i] = n / Math.pow(2, i * 8);
    n -= bytes[i] * Math.pow(2, i * 8);
  }
  return bytes;
}

const read = (s: string) =>
  readFileSync(require.resolve(s), "utf8")
    .replace(/\r+/gm, "")
    .replace(/\t/g, "    ")
    .replace(/\n{3,}/g, "\n\n");

export const functionStrings = {
  biguintAdd: read("./biguintAdd.glsl"),
  biguintAnd: read("./biguintAnd.glsl"),
  biguintAssign: read("./biguintAssign.glsl"),
  biguintAssignIfTrue: read("./biguintAssignIfTrue.glsl"),
  biguintDiv: read("./biguintDiv.glsl"),
  biguintEquals: read("./biguintEquals.glsl"),
  biguintGreaterThan: read("./biguintGreaterThan.glsl"),
  biguintGreaterThanOrEqual: read("./biguintGreaterThanOrEqual.glsl"),
  biguintLessThan: read("./biguintLessThan.glsl"),
  biguintLessThanOrEqual: read("./biguintLessThanOrEqual.glsl"),
  biguintLshift: read("./biguintLshift.glsl"),
  biguintLshiftByOne: read("./biguintLshiftByOne.glsl"),
  biguintLshiftByte: read("./biguintLshiftByte.glsl"),
  biguintLshiftWord: read("./biguintLshiftWord.glsl"),
  biguintMod: read("./biguintMod.glsl"),
  biguintMul: read("./biguintMul.glsl"),
  biguintOr: read("./biguintOr.glsl"),
  biguintOrByte: read("./biguintOrByte.glsl"),
  biguintPow: read("./biguintPow.glsl"),
  biguintRshift: read("./biguintRshift.glsl"),
  biguintRshiftByOne: read("./biguintRshiftByOne.glsl"),
  biguintRshiftByte: read("./biguintRshiftByte.glsl"),
  biguintRshiftWord: read("./biguintRshiftWord.glsl"),
  biguintSqrt: read("./biguintSqrt.glsl"),
  biguintSub: read("./biguintSub.glsl"),
  biguintXor: read("./biguintXor.glsl")
} as { [index: string]: string };

export const declarationObjects = {
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
} as {
  [index: string]: {
    prepend: string;
    declarations: string[];
    append: string;
  };
};

function findDependencies(s: string) {
  let i = 0;
  const output = [] as string[];
  const recurse = (parentName: string | null, parentString: string) => {
    if (i++ > 1e6) throw new Error("dependency loop detected");
    for (let [childName, decObj] of Object.entries(declarationObjects)) {
      for (let childDeclaration of decObj.declarations) {
        if (parentString.includes(childDeclaration)) {
          recurse(childName, functionStrings[childName]);
        }
      }
    }
    if (parentName && !output.includes(parentName)) {
      output.push(parentName);
    }
  };
  recurse(null, s);
  return output;
}

function removeDependencies(s: string) {
  for (let decObj of Object.values(declarationObjects)) {
    for (let childDeclaration of decObj.declarations) {
      while (s.includes(childDeclaration)) {
        s = s.replace(childDeclaration, "");
      }
    }
  }
  return s;
}

function prependDependencies(s: string, dependencies: string[]) {
  let output = "";
  for (let key of dependencies) {
    output += declarationObjects[key].prepend + "\n\n";
    output += removeDependencies(functionStrings[key]) + "\n\n";
    output += declarationObjects[key].append + "\n\n";
  }
  return output + s;
}

function removeDuplicateSubstring(s: string, subset: string) {
  const cursor = s.search(subset);
  const a = s.substring(0, cursor + subset.length);
  let b = s.substring(cursor);
  while (b.includes(subset)) b = b.replace(subset, "");
  return a + b;
}

(() => {
  const output = {} as { [index: string]: string };
  for (let key of Object.keys(functionStrings)) {
    const dependencies = findDependencies(functionStrings[key]);
    output[key] = prependDependencies(functionStrings[key], dependencies);
    output[key] = removeDependencies(output[key]);
    output[key] = removeDuplicateSubstring(
      output[key],
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
    );
    output[key] = `${declarationObjects[key].prepend}\n\n${output[key]}`;
    output[key] = `${output[key]}\n\n${declarationObjects[key].append}`;
    output[key] = output[key].replace(/\n{3,}/g, "\n\n");
  }
  Object.assign(functionStrings, output);
})();
