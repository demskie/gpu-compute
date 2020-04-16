import { readFileSync } from "fs";

const definitions = {
  // biguintByteCount: readFileSync(require.resolve("./biguintByteCount_00.glsl"), "utf8"),
  // biguintPrecision: readFileSync(require.resolve("./biguintPrecision_00.glsl"), "utf8"),
  biguintAdd: readFileSync(require.resolve("./biguintAdd_00.glsl"), "utf8"),
  biguintAnd: readFileSync(require.resolve("./biguintAnd_00.glsl"), "utf8"),
  biguintAssign: readFileSync(require.resolve("./biguintAssign_00.glsl"), "utf8"),
  biguintAssignIfTrue: readFileSync(require.resolve("./biguintAssignIfTrue_00.glsl"), "utf8"),
  biguintDiv: readFileSync(require.resolve("./biguintDiv_00.glsl"), "utf8"),
  biguintEquals: readFileSync(require.resolve("./biguintEquals_00.glsl"), "utf8"),
  biguintGreaterThan: readFileSync(require.resolve("./biguintGreaterThan_00.glsl"), "utf8"),
  biguintGreaterThanOrEqual: readFileSync(require.resolve("./biguintGreaterThanOrEqual_00.glsl"), "utf8"),
  biguintLessThan: readFileSync(require.resolve("./biguintLessThan_00.glsl"), "utf8"),
  biguintLessThanOrEqual: readFileSync(require.resolve("./biguintLessThanOrEqual_00.glsl"), "utf8"),
  biguintLshift: readFileSync(require.resolve("./biguintLshift_00.glsl"), "utf8"),
  biguintLshiftByOne: readFileSync(require.resolve("./biguintLshiftByOne_00.glsl"), "utf8"),
  biguintMod: readFileSync(require.resolve("./biguintMod_00.glsl"), "utf8"),
  biguintMul: readFileSync(require.resolve("./biguintMul_00.glsl"), "utf8"),
  biguintOr: readFileSync(require.resolve("./biguintOr_00.glsl"), "utf8"),
  biguintPow: readFileSync(require.resolve("./biguintPow_00.glsl"), "utf8"),
  biguintRshift: readFileSync(require.resolve("./biguintRshift_00.glsl"), "utf8"),
  biguintRshiftByOne: readFileSync(require.resolve("./biguintRshiftByOne_00.glsl"), "utf8"),
  biguintSqrt: readFileSync(require.resolve("./biguintSqrt_00.glsl"), "utf8"),
  biguintSub: readFileSync(require.resolve("./biguintSub_00.glsl"), "utf8"),
  biguintXor: readFileSync(require.resolve("./biguintXor_00.glsl"), "utf8")
} as { [index: string]: string };

const declarations = {
  // biguintByteCount: /#ifndef BYTE_COUNT\n#define BYTE_COUNT 16\n#endif/g,
  // biguintPrecision: /#ifdef GL_ES\nprecision highp float;\nprecision highp int;\n#endif/g,
  biguintAdd: /#ifndef BIG_UINT_ADD_00\nvoid biguintAdd\(in float \[BYTE_COUNT], in float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintAnd: /#ifndef BIG_UINT_AND_00\nvoid biguintAnd\(in float \[BYTE_COUNT], in float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintAssign: /#ifndef BIG_UINT_ASSIGN_00\nvoid biguintAssign\(inout float \[BYTE_COUNT], in float \[BYTE_COUNT]\);\n#endif/g,
  biguintAssignIfTrue: /#ifndef BIG_UINT_ASSIGN_IF_TRUE_00\nvoid biguintAssignIfTrue\(inout float \[BYTE_COUNT], in float \[BYTE_COUNT], bool\);\n#endif/g,
  biguintDiv: /#ifndef BIG_UINT_DIV_00\nvoid biguintDiv\(in float \[BYTE_COUNT], in float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintEquals: /#ifndef BIG_UINT_EQUALS_00\nbool biguintEquals\(in float \[BYTE_COUNT], in float \[BYTE_COUNT]\);\n#endif/g,
  biguintGreaterThan: /#ifndef BIG_UINT_GREATER_THAN_00\nbool biguintGreaterThan\(in float \[BYTE_COUNT], in float \[BYTE_COUNT]\);\n#endif/g,
  biguintGreaterThanOrEqual: /#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL_00\nbool biguintGreaterThanOrEqual\(in float \[BYTE_COUNT], in float \[BYTE_COUNT]\);\n#endif/g,
  biguintLessThan: /#ifndef BIG_UINT_LESS_THAN_00\nbool biguintLessThan\(in float \[BYTE_COUNT], in float \[BYTE_COUNT]\);\n#endif/g,
  biguintLessThanOrEqual: /#ifndef BIG_UINT_LESS_THAN_OR_EQUAL_00\nbool biguintLessThanOrEqual\(in float \[BYTE_COUNT], in float \[BYTE_COUNT]\);\n#endif/g,
  biguintLshift: /#ifndef BIG_UINT_LSHIFT_00\nvoid biguintLshift\(in float \[BYTE_COUNT], inout float \[BYTE_COUNT], float\);\n#endif/g,
  biguintLshiftByOne: /#ifndef BIG_UINT_LSHIFT_BY_ONE_00\nvoid biguintLshiftByOne\(inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintMod: /#ifndef BIG_UINT_MOD_00\nvoid biguintMod\(in float \[BYTE_COUNT], in float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintMul: /#ifndef BIG_UINT_MUL_00\nvoid biguintMul\(in float \[BYTE_COUNT], in float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintOr: /#ifndef BIG_UINT_OR_00\nvoid biguintOr\(in float \[BYTE_COUNT], in float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintPow: /#ifndef BIG_UINT_POW_00\nvoid biguintPow\(in float \[BYTE_COUNT], in float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintRshift: /#ifndef BIG_UINT_RSHIFT_00\nvoid biguintRshift\(in float \[BYTE_COUNT], inout float \[BYTE_COUNT], float\);\n#endif/g,
  biguintRshiftByOne: /#ifndef BIG_UINT_RSHIFT_BY_ONE_00\nvoid biguintRshiftByOne\(inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintSqrt: /#ifndef BIG_UINT_SQRT_00\nvoid biguintSqrt\(in float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintSub: /#ifndef BIG_UINT_SUB_00\nvoid biguintSub\(in float \[BYTE_COUNT], in float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\n#endif/g,
  biguintXor: /#ifndef BIG_UINT_XOR_00\nvoid biguintXor\(in float \[BYTE_COUNT], in float \[BYTE_COUNT], inout float \[BYTE_COUNT]\);\n#endif/g
};

// TODO: actually remove redundant code inlining

for (let [k, v] of Object.entries(definitions)) {
  const defined = [] as string[];
  defined.push(k);
  const searchAndReplace = (s: string): string => {
    for (let [dk, rgx] of Object.entries(declarations)) {
      while (s.search(rgx) > -1) {
        if (!defined.includes(dk)) {
          defined.push(dk);
          definitions[dk] = searchAndReplace(definitions[dk]);
          s = s.replace(rgx, definitions[dk]);
        } else {
          s = s.replace(rgx, "");
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
  biguintMod: definitions["biguintMod"],
  biguintMul: definitions["biguintMul"],
  biguintOr: definitions["biguintOr"],
  biguintPow: definitions["biguintPow"],
  biguintRshift: definitions["biguintRshift"],
  biguintRshiftByOne: definitions["biguintRshiftByOne"],
  biguintSqrt: definitions["biguintSqrt"],
  biguintSub: definitions["biguintSub"],
  biguintXor: definitions["biguintXor"]
};
