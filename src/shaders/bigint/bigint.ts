import { readFileSync } from "fs";

/*
void bigintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void bigintAnd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void bigintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);
void bigintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);
void bigintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
float bigintEquals(float [BYTE_COUNT], float [BYTE_COUNT]);
float bigintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);
float bigintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);
float bigintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);
float bigintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);
void bigintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);
void bigintLshiftByOne(inout float [BYTE_COUNT]);
void bigintMod(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void bigintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void bigintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void bigintPow(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);
void bigintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);
void bigintRshiftByOne(inout float [BYTE_COUNT]);
void bigintSqrt(float [BYTE_COUNT], inout float [BYTE_COUNT]);
void bigintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void bigintXor(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
*/

function flipBits(bytes: Uint8Array) {
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = 255 - bytes[i];
  }
}

function addOne(bytes: Uint8Array) {
  let carry = 1;
  for (let i = 0; i < bytes.length; i++) {
    let v = bytes[i] + carry;
    if (v <= 255) {
      carry = 0;
    }
    bytes[i] = v % 256;
  }
}

function applyTwosComplement(bytes: Uint8Array, negative: boolean) {
  if (bytes[bytes.length - 1] >= 128) {
    bytes[bytes.length - 1] -= 128;
  }
  if (negative) {
    flipBits(bytes);
    addOne(bytes);
  }
}

function removeTwosComplement(bytes: Uint8Array) {
  const negative = bytes[bytes.length - 1] >= 128;
  if (negative) {
    flipBits(bytes);
    addOne(bytes);
  }
  return negative;
}

export function int64ToBytes(i: number) {
  let u = Math.abs(i);
  const bytes = new Uint8Array(16);
  for (let i = 5; i >= 0; i--) {
    bytes[i] = u / Math.pow(2, i * 8);
    u -= bytes[i] * Math.pow(2, i * 8);
  }
  applyTwosComplement(bytes, i < 0);
  return bytes;
}

export function bytesToInt64(bytes: Uint8Array) {
  const negative = removeTwosComplement(bytes);
  let n = 0;
  for (let i = 0; i < 6; i++) {
    n += bytes[i] * Math.pow(2, i * 8);
  }
  applyTwosComplement(bytes, negative);
  if (negative) return -n;
  return n;
}

const read = (s: string) => readFileSync(require.resolve(s), "utf8").replace(/\r+/gm, "");

const definitions = {
  bigintAbs: read("./bigintAbs_00.glsl"),
  bigintAdd: read("./bigintAdd_00.glsl"),
  bigintAddFloat: read("./bigintAddFloat_00.glsl"),
  bigintAnd: read("./bigintAnd_00.glsl"),
  bigintAssign: read("./bigintAssign_00.glsl"),
  bigintAssignFloat: read("./bigintAssignFloat_00.glsl"),
  bigintAssignFloatIfTrue: read("./bigintAssignFloatIfTrue_00.glsl"),
  bigintAssignIfTrue: read("./bigintAssignIfTrue_00.glsl"),
  bigintDiv: read("./bigintDiv_00.glsl"),
  bigintEquals: read("./bigintEquals_00.glsl"),
  bigintGreaterThan: read("./bigintGreaterThan_00.glsl"),
  bigintGreaterThanOrEqual: read("./bigintGreaterThanOrEqual_00.glsl"),
  bigintLessThan: read("./bigintLessThan_00.glsl"),
  bigintLessThanOrEqual: read("./bigintLessThanOrEqual_00.glsl"),
  bigintLshift: read("./bigintLshift_00.glsl"),
  bigintLshiftByOne: read("./bigintLshiftByOne_00.glsl"),
  bigintLshiftByte: read("./bigintLshiftByte_00.glsl"),
  bigintLshiftWord: read("./bigintLshiftWord_00.glsl"),
  bigintMod: read("./bigintMod_00.glsl"),
  bigintMul: read("./bigintMul_00.glsl"),
  bigintOr: read("./bigintOr_00.glsl"),
  bigintOrByte: read("./bigintOrByte_00.glsl"),
  bigintPow: read("./bigintPow_00.glsl"),
  bigintRshift: read("./bigintRshift_00.glsl"),
  bigintRshiftByOne: read("./bigintRshiftByOne_00.glsl"),
  bigintRshiftByte: read("./bigintRshiftByte_00.glsl"),
  bigintRshiftWord: read("./bigintRshiftWord_00.glsl"),
  bigintSqrt: read("./bigintSqrt_00.glsl"),
  bigintSub: read("./bigintSub_00.glsl"),
  bigintSubFloat: read("./bigintSubFloat_00.glsl"),
  bigintXor: read("./bigintXor_00.glsl")
} as { [index: string]: string };

const declarations = {
  bigintAbs: /#ifndef BIG_UINT_ABS_00\s*void bigintAbs\(inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintAdd: /#ifndef BIG_UINT_ADD_00\s*void bigintAdd\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintAddFloat: /#ifndef BIG_UINT_ADD_FLOAT_00\s*void bigintAddFloat\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintAnd: /#ifndef BIG_UINT_AND_00\s*void bigintAnd\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintAssign: /#ifndef BIG_UINT_ASSIGN_00\s*void bigintAssign\(inout float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  bigintAssignFloat: /#ifndef BIG_UINT_ASSIGN_FLOAT_00\s*void bigintAssignFloat\(inout float \[BYTE_COUNT], float\);\s*#endif/g,
  bigintAssignFloatIfTrue: /#ifndef BIG_UINT_ASSIGN_FLOAT_IF_TRUE_00\s*void bigintAssignFloatIfTrue\(inout float \[BYTE_COUNT], float, float\);\s*#endif/g,
  bigintAssignIfTrue: /#ifndef BIG_UINT_ASSIGN_IF_TRUE_00\s*void bigintAssignIfTrue\(inout float \[BYTE_COUNT], float \[BYTE_COUNT], float\);\s*#endif/g,
  bigintDiv: /#ifndef BIG_UINT_DIV_00\s*void bigintDiv\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintEquals: /#ifndef BIG_UINT_EQUALS_00\s*float bigintEquals\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  bigintGreaterThan: /#ifndef BIG_UINT_GREATER_THAN_00\s*float bigintGreaterThan\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  bigintGreaterThanOrEqual: /#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL_00\s*float bigintGreaterThanOrEqual\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  bigintLessThan: /#ifndef BIG_UINT_LESS_THAN_00\s*float bigintLessThan\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  bigintLessThanOrEqual: /#ifndef BIG_UINT_LESS_THAN_OR_EQUAL_00\s*float bigintLessThanOrEqual\(float \[BYTE_COUNT], float \[BYTE_COUNT]\);\s*#endif/g,
  bigintLshift: /#ifndef BIG_UINT_LSHIFT_00\s*void bigintLshift\(float \[BYTE_COUNT], inout float \[BYTE_COUNT], float\);\s*#endif/g,
  bigintLshiftByOne: /#ifndef BIG_UINT_LSHIFT_BY_ONE_00\s*void bigintLshiftByOne\(inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintLshiftByte: /#ifndef BIG_UINT_LSHIFT_BYTE_00\s*float bigintLshiftByte\(float, float\);\s*#endif/g,
  bigintLshiftWord: /#ifndef BIG_UINT_LSHIFT_WORD_00\s*void bigintLshiftWord\(inout float \[BYTE_COUNT], float\);\s*#endif/g,
  bigintMod: /#ifndef BIG_UINT_MOD_00\s*void bigintMod\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintMul: /#ifndef BIG_UINT_MUL_00\s*void bigintMul\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintOr: /#ifndef BIG_UINT_OR_00\s*void bigintOr\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintOrByte: /#ifndef BIG_UINT_OR_BYTE_00\s*float bigintOrByte\(float, float\);\s*#endif/g,
  bigintPow: /#ifndef BIG_UINT_POW_00\s*void bigintPow\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintRshift: /#ifndef BIG_UINT_RSHIFT_00\s*void bigintRshift\(float \[BYTE_COUNT], inout float \[BYTE_COUNT], float\);\s*#endif/g,
  bigintRshiftByOne: /#ifndef BIG_UINT_RSHIFT_BY_ONE_00\s*void bigintRshiftByOne\(inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintRshiftByte: /#ifndef BIG_UINT_RSHIFT_BYTE_00\s*float bigintRshiftByte\(float, float\);\s*#endif/g,
  bigintRshiftWord: /#ifndef BIG_UINT_RSHIFT_WORD_00\s*void bigintRshiftWord\(inout float \[BYTE_COUNT], float\);\s*#endif/g,
  bigintSqrt: /#ifndef BIG_UINT_SQRT_00\s*void bigintSqrt\(float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintSub: /#ifndef BIG_UINT_SUB_00\s*void bigintSub\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintSubFloat: /#ifndef BIG_UINT_SUB_FLOAT_00\s*void bigintSubFloat\(float \[BYTE_COUNT], float, inout float \[BYTE_COUNT]\);\s*#endif/g,
  bigintXor: /#ifndef BIG_UINT_XOR_00\s*void bigintXor\(float \[BYTE_COUNT], float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\s*#endif/g
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
  bigintAbs: definitions["bigintAbs"],
  bigintAdd: definitions["bigintAdd"],
  bigintAddFloat: definitions["bigintAddFloat"],
  bigintAnd: definitions["bigintAnd"],
  bigintAssign: definitions["bigintAssign"],
  bigintAssignFloat: definitions["bigintAssignFloat"],
  bigintAssignFloatIfTrue: definitions["bigintAssignFloatIfTrue"],
  bigintAssignIfTrue: definitions["bigintAssignIfTrue"],
  bigintDiv: definitions["bigintDiv"],
  bigintEquals: definitions["bigintEquals"],
  bigintGreaterThan: definitions["bigintGreaterThan"],
  bigintGreaterThanOrEqual: definitions["bigintGreaterThanOrEqual"],
  bigintLessThan: definitions["bigintLessThan"],
  bigintLessThanOrEqual: definitions["bigintLessThanOrEqual"],
  bigintLshift: definitions["bigintLshift"],
  bigintLshiftByOne: definitions["bigintLshiftByOne"],
  bigintLshiftByte: definitions["bigintLshiftByte"],
  bigintLshiftWord: definitions["bigintLshiftWord"],
  bigintMod: definitions["bigintMod"],
  bigintMul: definitions["bigintMul"],
  bigintOr: definitions["bigintOr"],
  bigintOrByte: definitions["bigintOrByte"],
  bigintPow: definitions["bigintPow"],
  bigintRshift: definitions["bigintRshift"],
  bigintRshiftByOne: definitions["bigintRshiftByOne"],
  bigintRshiftByte: definitions["bigintRshiftByte"],
  bigintRshiftWord: definitions["bigintRshiftWord"],
  bigintSqrt: definitions["bigintSqrt"],
  bigintSub: definitions["bigintSub"],
  bigintSubFloat: definitions["bigintSubFloat"],
  bigintXor: definitions["bigintXor"]
};

export const declarationToDefinition = {
  "void bigintAbs(inout float [BYTE_COUNT]);": functionStrings.bigintAbs,
  "void bigintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.bigintAdd,
  "void bigintAddFloat(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.bigintAddFloat,
  "void bigintAnd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.bigintAnd,
  "void bigintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.bigintAssign,
  "void bigintAssignFloat(inout float [BYTE_COUNT], float);": functionStrings.bigintAssignFloat,
  "void bigintAssignFloatIfTrue(inout float [BYTE_COUNT], float, float);": functionStrings.bigintAssignFloatIfTrue,
  "void bigintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);": functionStrings.bigintAssignIfTrue,
  "void bigintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.bigintDiv,
  "float bigintEquals(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.bigintEquals,
  "float bigintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.bigintGreaterThan,
  "float bigintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.bigintGreaterThanOrEqual,
  "float bigintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.bigintLessThan,
  "float bigintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);": functionStrings.bigintLessThanOrEqual,
  "void bigintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);": functionStrings.bigintLshift,
  "void bigintLshiftByOne(inout float [BYTE_COUNT]);": functionStrings.bigintLshiftByOne,
  "float bigintLshiftByte(float, float);": functionStrings.bigintLshiftByte,
  "void bigintLshiftWord(inout float [BYTE_COUNT], float);": functionStrings.bigintLshiftWord,
  "void bigintMod(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.bigintMod,
  "void bigintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.bigintMul,
  "void bigintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.bigintOr,
  "float bigintOrByte(float, float);": functionStrings.bigintOrByte,
  "void bigintPow(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.bigintPow,
  "void bigintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);": functionStrings.bigintRshift,
  "void bigintRshiftByOne(inout float [BYTE_COUNT]);": functionStrings.bigintRshiftByOne,
  "float bigintRshiftByte(float, float);": functionStrings.bigintRshiftByte,
  "void bigintRshiftWord(inout float [BYTE_COUNT], float);": functionStrings.bigintRshiftWord,
  "void bigintSqrt(float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.bigintSqrt,
  "void bigintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.bigintSub,
  "void bigintSubFloat(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);": functionStrings.bigintSubFloat,
  "void bigintXor(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);": functionStrings.bigintXor
};
