import { readFileSync } from "fs";

/*
void biguintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintAnd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);
void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);
void biguintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
float biguintEquals(float [BYTE_COUNT], float [BYTE_COUNT]);
float biguintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);
float biguintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);
float biguintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);
float biguintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);
void biguintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);
void biguintLshiftByOne(inout float [BYTE_COUNT]);
void biguintMod(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintPow(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);
void biguintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);
void biguintRshiftByOne(inout float [BYTE_COUNT]);
void biguintSqrt(float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintXor(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
*/

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
  biguintAdd: read("./biguintAdd_00.glsl"),
  biguintAddFloat: read("./biguintAddFloat_00.glsl"),
  biguintAnd: read("./biguintAnd_00.glsl"),
  biguintAssign: read("./biguintAssign_00.glsl"),
  biguintAssignFloat: read("./biguintAssignFloat_00.glsl"),
  biguintAssignIfTrue: read("./biguintAssignIfTrue_00.glsl"),
  biguintAssignFloatIfTrue: read("./biguintAssignFloatIfTrue_00.glsl"),
  biguintDiv: read("./biguintDiv_00.glsl"),
  biguintEquals: read("./biguintEquals_00.glsl"),
  biguintGreaterThan: read("./biguintGreaterThan_00.glsl"),
  biguintGreaterThanOrEqual: read("./biguintGreaterThanOrEqual_00.glsl"),
  biguintLessThan: read("./biguintLessThan_00.glsl"),
  biguintLessThanOrEqual: read("./biguintLessThanOrEqual_00.glsl"),
  biguintLshift: read("./biguintLshift_00.glsl"),
  biguintLshiftByOne: read("./biguintLshiftByOne_00.glsl"),
  biguintLshiftByte: read("./biguintLshiftByte_00.glsl"),
  biguintLshiftWord: read("./biguintLshiftWord_00.glsl"),
  biguintMod: read("./biguintMod_00.glsl"),
  biguintMul: read("./biguintMul_00.glsl"),
  biguintOr: read("./biguintOr_00.glsl"),
  biguintOrByte: read("./biguintOrByte_00.glsl"),
  biguintPow: read("./biguintPow_00.glsl"),
  biguintRshift: read("./biguintRshift_00.glsl"),
  biguintRshiftByOne: read("./biguintRshiftByOne_00.glsl"),
  biguintRshiftByte: read("./biguintRshiftByte_00.glsl"),
  biguintRshiftWord: read("./biguintRshiftWord_00.glsl"),
  biguintSqrt: read("./biguintSqrt_00.glsl"),
  biguintSub: read("./biguintSub_00.glsl"),
  biguintSubFloat: read("./biguintSubFloat_00.glsl"),
  biguintXor: read("./biguintXor_00.glsl")
} as { [index: string]: string };

const declarations = {
  biguintAdd: /#ifndef BIG_UINT_ADD_00\s*void biguintAdd\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintAddFloat: /#ifndef BIG_UINT_ADD_FLOAT_00\s*void biguintAddFloat\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintAnd: /#ifndef BIG_UINT_AND_00\s*void biguintAnd\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintAssign: /#ifndef BIG_UINT_ASSIGN_00\s*void biguintAssign\(inout float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  biguintAssignFloat: /#ifndef BIG_UINT_ASSIGN_FLOAT_00\s*void biguintAssignFloat\(inout float \[BYTE_COUNT], float\);\s*#endif/g,
  biguintAssignIfTrue: /#ifndef BIG_UINT_ASSIGN_IF_TRUE_00\s*void biguintAssignIfTrue\(inout float \[BYTE_COUNT], float \[BYTE_COUNT], float\);\s*#endif/g,
  biguintAssignFloatIfTrue: /#ifndef BIG_UINT_ASSIGN_FLOAT_IF_TRUE_00\s*void biguintAssignFloatIfTrue\(inout float \[BYTE_COUNT], float, float\);\s*#endif/g,
  biguintDiv: /#ifndef BIG_UINT_DIV_00\s*void biguintDiv\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintEquals: /#ifndef BIG_UINT_EQUALS_00\s*float biguintEquals\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  biguintGreaterThan: /#ifndef BIG_UINT_GREATER_THAN_00\s*float biguintGreaterThan\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  biguintGreaterThanOrEqual: /#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL_00\s*float biguintGreaterThanOrEqual\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  biguintLessThan: /#ifndef BIG_UINT_LESS_THAN_00\s*float biguintLessThan\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  biguintLessThanOrEqual: /#ifndef BIG_UINT_LESS_THAN_OR_EQUAL_00\s*float biguintLessThanOrEqual\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  biguintLshift: /#ifndef BIG_UINT_LSHIFT_00\s*void biguintLshift\(float \[BYTE_COUNT], inout float \[BYTE_COUNT], float\);\s*#endif/g,
  biguintLshiftByOne: /#ifndef BIG_UINT_LSHIFT_BY_ONE_00\s*void biguintLshiftByOne\(inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintLshiftByte: /#ifndef BIG_UINT_LSHIFT_BYTE_00\s*float biguintLshiftByte\(float, float\);\s*#endif/g,
  biguintLshiftWord: /#ifndef BIG_UINT_LSHIFT_WORD_00\s*void biguintLshiftWord\(inout float \[BYTE_COUNT], float\);\s*#endif/g,
  biguintMod: /#ifndef BIG_UINT_MOD_00\s*void biguintMod\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintMul: /#ifndef BIG_UINT_MUL_00\s*void biguintMul\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintOr: /#ifndef BIG_UINT_OR_00\s*void biguintOr\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintOrByte: /#ifndef BIG_UINT_OR_BYTE_00\s*float biguintOrByte\(float, float\);\s*#endif/g,
  biguintPow: /#ifndef BIG_UINT_POW_00\s*void biguintPow\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintRshift: /#ifndef BIG_UINT_RSHIFT_00\s*void biguintRshift\(float \[BYTE_COUNT], inout float \[BYTE_COUNT], float\);\s*#endif/g,
  biguintRshiftByOne: /#ifndef BIG_UINT_RSHIFT_BY_ONE_00\s*void biguintRshiftByOne\(inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintRshiftByte: /#ifndef BIG_UINT_RSHIFT_BYTE_00\s*float biguintRshiftByte\(float, float\);\s*#endif/g,
  biguintRshiftWord: /#ifndef BIG_UINT_RSHIFT_WORD_00\s*void biguintRshiftWord\(inout float \[BYTE_COUNT], float\);\s*#endif/g,
  biguintSqrt: /#ifndef BIG_UINT_SQRT_00\s*void biguintSqrt\(float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintSub: /#ifndef BIG_UINT_SUB_00\s*void biguintSub\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintSubFloat: /#ifndef BIG_UINT_SUB_FLOAT_00\s*void biguintSubFloat\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g,
  biguintXor: /#ifndef BIG_UINT_XOR_00\s*void biguintXor\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g
};

for (let [k, v] of Object.entries(definitions)) {
  const defined = [] as string[];
  defined.push(k);
  const searchAndReplace = (s: string): string => {
    for (let [dk, rgx] of Object.entries(declarations)) {
      if (s.search(rgx) > -1 && !defined.includes(dk)) {
        defined.push(dk);
        definitions[dk] = searchAndReplace(definitions[dk]);
        s = s.replace(rgx, definitions[dk]);
      }
    }
    return s;
  };
  definitions[k] = searchAndReplace(v);
}

export const functionStrings = {
  biguintAdd: definitions["biguintAdd"],
  biguintAddFloat: definitions["biguintAddFloat"],
  biguintAnd: definitions["biguintAnd"],
  biguintAssign: definitions["biguintAssign"],
  biguintAssignFloat: definitions["biguintAssignFloat"],
  biguintAssignIfTrue: definitions["biguintAssignIfTrue"],
  biguintAssignFloatIfTrue: definitions["biguintAssignFloatIfTrue"],
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
  biguintSubFloat: definitions["biguintSubFloat"],
  biguintXor: definitions["biguintXor"]
};

export const declarationToDefinition = {
  "void biguintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintAdd,
  "void biguintAddFloat(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.biguintAddFloat,
  "void biguintAnd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintAnd,
  "void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintAssign,
  "void biguintAssignFloat(inout float [BYTE_COUNT], float);": functionStrings.biguintAssignFloat,
  "void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);": functionStrings.biguintAssignIfTrue,
  "void biguintAssignFloatIfTrue(inout float [BYTE_COUNT], float, float);": functionStrings.biguintAssignIfTrue,
  "void biguintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintDiv,
  "float biguintEquals(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintEquals,
  "float biguintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintGreaterThan,
  "float biguintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintGreaterThanOrEqual,
  "float biguintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintLessThan,
  "float biguintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.biguintLessThanOrEqual,
  "void biguintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);": functionStrings.biguintLshift,
  "void biguintLshiftByOne(inout float [BYTE_COUNT]);": functionStrings.biguintLshiftByOne,
  "float biguintLshiftByte(float, float);": functionStrings.biguintLshiftByte,
  "void biguintLshiftWord(inout float [BYTE_COUNT], float);": functionStrings.biguintLshiftWord,
  "void biguintMod(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintMod,
  "void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintMul,
  "void biguintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintOr,
  "float biguintOrByte(float, float);": functionStrings.biguintOrByte,
  "void biguintPow(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.biguintPow,
  "void biguintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);": functionStrings.biguintRshift,
  "void biguintRshiftByOne(inout float [BYTE_COUNT]);": functionStrings.biguintRshiftByOne,
  "float biguintRshiftByte(float, float);": functionStrings.biguintRshiftByte,
  "void biguintRshiftWord(inout float [BYTE_COUNT], float);": functionStrings.biguintRshiftWord,
  "void biguintSqrt(float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintSqrt,
  "void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintSub,
  "void biguintSubFloat(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.biguintSubFloat,
  "void biguintXor(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.biguintXor
};
