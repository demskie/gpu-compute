import { readFileSync } from "fs";

function getEscapedRegExp(s: string) {
  return new RegExp(s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
}
export function uint64ToBytes(n: number) {
  const bytes = new Uint8Array(16);
  for (let i = 5; i >= 0; i--) {
    bytes[i] = n / Math.pow(2, i * 8);
    n -= bytes[i] * Math.pow(2, i * 8);
  }
  return bytes;
}

export function bytesToUint64(bytes: Uint8Array) {
  let n = 0;
  for (let i = 0; i < 6; i++) {
    n += bytes[i] * Math.pow(2, i * 8);
  }
  return n;
}

const read = (s: string) => readFileSync(require.resolve(s), "utf8").replace(/\r+/gm, "");

const definitions = {
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

const declarations = {
  biguintAdd: [
    /#ifndef BIG_UINT_ADD\s*void biguintAdd\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_ADD\s*void biguintAdd\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintAnd: [
    /#ifndef BIG_UINT_AND\s*void biguintAnd\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintAssign: [
    /#ifndef BIG_UINT_ASSIGN\s*void biguintAssign\(inout float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_ASSIGN\s*void biguintAssign\(inout float \[BYTE_COUNT], float\);\s*#endif/g
  ],
  biguintAssignIfTrue: [
    /#ifndef BIG_UINT_ASSIGN_IF_TRUE\s*void biguintAssignIfTrue\(inout float \[BYTE_COUNT], float \[BYTE_COUNT], float\);\s*#endif/g,
    /#ifndef BIG_UINT_ASSIGN_IF_TRUE\s*void biguintAssignIfTrue\(inout float \[BYTE_COUNT], float, float\);\s*#endif/g
  ],
  biguintDiv: [
    /#ifndef BIG_UINT_DIV\s*void biguintDiv\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_DIV\s*void biguintDiv\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintEquals: [
    /#ifndef BIG_UINT_EQUALS\s*float biguintEquals\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_EQUALS\s*float biguintEquals\(float \[BYTE_COUNT], float\);\s*#endif/g
  ],
  biguintGreaterThan: [
    /#ifndef BIG_UINT_GREATER_THAN\s*float biguintGreaterThan\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_GREATER_THAN\s*float biguintGreaterThan\(float \[BYTE_COUNT], float\);\s*#endif/g
  ],
  biguintGreaterThanOrEqual: [
    /#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL\s*float biguintGreaterThanOrEqual\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL\s*float biguintGreaterThanOrEqual\(float \[BYTE_COUNT], float\);\s*#endif/g
  ],
  biguintLessThan: [
    /#ifndef BIG_UINT_LESS_THAN\s*float biguintLessThan\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_LESS_THAN\s*float biguintLessThan\(float \[BYTE_COUNT], float\);\s*#endif/g
  ],
  biguintLessThanOrEqual: [
    /#ifndef BIG_UINT_LESS_THAN_OR_EQUAL\s*float biguintLessThanOrEqual\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_LESS_THAN_OR_EQUAL\s*float biguintLessThanOrEqual\(float \[BYTE_COUNT], float\);\s*#endif/g
  ],
  biguintLshift: [
    /#ifndef BIG_UINT_LSHIFT\s*void biguintLshift\(float \[BYTE_COUNT], inout float \[BYTE_COUNT], float\);\s*#endif/g
  ],
  biguintLshiftByOne: [
    /#ifndef BIG_UINT_LSHIFT_BY_ONE\s*void biguintLshiftByOne\(inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintLshiftByte: [/#ifndef BIG_UINT_LSHIFT_BYTE\s*float biguintLshiftByte\(float, float\);\s*#endif/g],
  biguintLshiftWord: [
    /#ifndef BIG_UINT_LSHIFT_WORD\s*void biguintLshiftWord\(inout float \[BYTE_COUNT], float\);\s*#endif/g
  ],
  biguintMod: [
    /#ifndef BIG_UINT_MOD\s*void biguintMod\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_MOD\s*void biguintMod\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintMul: [
    /#ifndef BIG_UINT_MUL\s*void biguintMul\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_MUL\s*void biguintMul\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintOr: [
    /#ifndef BIG_UINT_OR\s*void biguintOr\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintOrByte: [/#ifndef BIG_UINT_OR_BYTE\s*float biguintOrByte\(float, float\);\s*#endif/g],
  biguintPow: [
    /#ifndef BIG_UINT_POW\s*void biguintPow\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintRshift: [
    /#ifndef BIG_UINT_RSHIFT\s*void biguintRshift\(float \[BYTE_COUNT], inout float \[BYTE_COUNT], float\);\s*#endif/g
  ],
  biguintRshiftByOne: [
    /#ifndef BIG_UINT_RSHIFT_BY_ONE\s*void biguintRshiftByOne\(inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintRshiftByte: [/#ifndef BIG_UINT_RSHIFT_BYTE\s*float biguintRshiftByte\(float, float\);\s*#endif/g],
  biguintRshiftWord: [
    /#ifndef BIG_UINT_RSHIFT_WORD\s*void biguintRshiftWord\(inout float \[BYTE_COUNT], float\);\s*#endif/g
  ],
  biguintSqrt: [
    /#ifndef BIG_UINT_SQRT\s*void biguintSqrt\(float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_SQRT\s*void biguintSqrt\(inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintSub: [
    /#ifndef BIG_UINT_SUB\s*void biguintSub\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
    /#ifndef BIG_UINT_SUB\s*void biguintSub\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g
  ],
  biguintXor: [
    /#ifndef BIG_UINT_XOR\s*void biguintXor\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g
  ]
};

for (let [k, v] of Object.entries(definitions)) {
  const defined = [] as string[];
  defined.push(k);
  const searchAndReplace = (s: string): string => {
    for (let [dk, arr] of Object.entries(declarations)) {
      for (let rgx of arr) {
        if (s.search(rgx) > -1 && !defined.includes(dk)) {
          defined.push(dk);
          definitions[dk] = searchAndReplace(definitions[dk]);
          s = s.replace(rgx, definitions[dk]);
        }
      }
    }
    return s;
  };
  definitions[k] = searchAndReplace(v);
}

export const functionStrings = {
  biguintAdd: definitions["biguintAdd"],
  biguintAnd: definitions["biguintAnd"],
  biguintAssign: definitions["biguintAssign"],
  biguintAssignIfTrue: definitions["biguintAssignIfTrue"],
  biguintDiv: definitions["biguintDiv"],
  biguintEquals: definitions["biguintEquals"],
  biguintGreaterThan: definitions["biguintGreaterThan"],
  biguintGreaterThanOrEqual: definitions["biguintGreaterThanOrEqual"],
  biguintLessThan: definitions["biguintLessThan"],
  biguintLessThanOrEqual: definitions["biguintLessThanOrEqual"],
  biguintLshift: definitions["biguintLshift"],
  biguintLshiftByOne: definitions["biguintLshiftByOne"],
  biguintLshiftByte: definitions["biguintLshiftByte"],
  biguintLshiftWord: definitions["biguintLshiftWord"],
  biguintMod: definitions["biguintMod"],
  biguintMul: definitions["biguintMul"],
  biguintOr: definitions["biguintOr"],
  biguintOrByte: definitions["biguintOrByte"],
  biguintPow: definitions["biguintPow"],
  biguintRshift: definitions["biguintRshift"],
  biguintRshiftByOne: definitions["biguintRshiftByOne"],
  biguintRshiftByte: definitions["biguintRshiftByte"],
  biguintRshiftWord: definitions["biguintRshiftWord"],
  biguintSqrt: definitions["biguintSqrt"],
  biguintSub: definitions["biguintSub"],
  biguintXor: definitions["biguintXor"]
};

export const declarationToDefinition = {
  "void biguintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintAdd,
  "void biguintAdd(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.biguintAdd,

  "void biguintAnd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintAnd,

  "void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintAssign,
  "void biguintAssign(inout float [BYTE_COUNT], float);": functionStrings.biguintAssign,

  "void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);": functionStrings.biguintAssignIfTrue,
  "void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], bool);": functionStrings.biguintAssignIfTrue,
  "void biguintAssignIfTrue(inout float [BYTE_COUNT], float, float);": functionStrings.biguintAssignIfTrue,
  "void biguintAssignIfTrue(inout float [BYTE_COUNT], float, bool);": functionStrings.biguintAssignIfTrue,

  "void biguintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintDiv,
  "void biguintDiv(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.biguintDiv,

  "float biguintEquals(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintEquals,
  "float biguintEquals(float [BYTE_COUNT], float);": functionStrings.biguintEquals,

  "float biguintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintGreaterThan,
  "float biguintGreaterThan(float [BYTE_COUNT], float);": functionStrings.biguintGreaterThan,

  "float biguintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintGreaterThanOrEqual,
  "float biguintGreaterThanOrEqual(float [BYTE_COUNT], float);": functionStrings.biguintGreaterThanOrEqual,

  "float biguintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintLessThan,
  "float biguintLessThan(float [BYTE_COUNT], float);": functionStrings.biguintLessThan,

  "float biguintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintLessThanOrEqual,
  "float biguintLessThanOrEqual(float [BYTE_COUNT], float);": functionStrings.biguintLessThanOrEqual,

  "void biguintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);": functionStrings.biguintLshift,

  "void biguintLshiftByOne(inout float [BYTE_COUNT]);": functionStrings.biguintLshiftByOne,

  "float biguintLshiftByte(float, float);": functionStrings.biguintLshiftByte,

  "void biguintLshiftWord(inout float [BYTE_COUNT], float);": functionStrings.biguintLshiftWord,

  "void biguintMod(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintMod,
  "void biguintMod(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.biguintMod,

  "void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintMul,
  "void biguintMul(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.biguintMul,

  "void biguintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintOr,

  "float biguintOrByte(float, float);": functionStrings.biguintOrByte,

  "void biguintPow(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.biguintPow,

  "void biguintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);": functionStrings.biguintRshift,

  "void biguintRshiftByOne(inout float [BYTE_COUNT]);": functionStrings.biguintRshiftByOne,

  "float biguintRshiftByte(float, float);": functionStrings.biguintRshiftByte,

  "void biguintRshiftWord(inout float [BYTE_COUNT], float);": functionStrings.biguintRshiftWord,

  "void biguintSqrt(float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintSqrt,

  "void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintSub,
  "void biguintSub(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.biguintSub,

  "void biguintXor(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintXor
};
