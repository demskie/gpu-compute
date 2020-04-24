#ifndef BIG_UINT_DIV_00
#define BIG_UINT_DIV_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef FLOAT_EQ_00
#define FLOAT_EQ_00
float eq(float f1, float f2) {
  return 1.0 - abs(sign(f1 - f2));
}
#endif

#ifndef FLOAT_NE_00
#define FLOAT_NE_00
float ne(float f1, float f2) {
  return abs(sign(f1 - f2));
}
#endif

#ifndef FLOAT_LT_00
#define FLOAT_LT_00
float lt(float f1, float f2) {
  return max(sign(f2 - f1), 0.0);
}
#endif

#ifndef FLOAT_GT_00
#define FLOAT_GT_00
float gt(float f1, float f2) {
  return max(sign(f1 - f2), 0.0);
}
#endif

#ifndef FLOAT_GTE_00
#define FLOAT_GTE_00
float gte(float f1, float f2) {
  return 1.0 - max(sign(f2 - f1), 0.0); 
}
#endif

#ifndef BIG_UINT_RSHIFT_00
void biguintRshift(in float [BYTE_COUNT], inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_GREATER_THAN_00
#define BIG_UINT_GREATER_THAN_00
float biguintGreaterThan(in float a[BYTE_COUNT], in float b[BYTE_COUNT]) {
    float cmp;
    for (int i = BYTE_COUNT - 1; i >= 0; i--)
        cmp += eq(cmp, 0.0) * gt(a[i], b[i])
             - eq(cmp, 0.0) * lt(a[i], b[i]);
    return eq(cmp, 1.0);
}
#endif

#ifndef BIG_UINT_LSHIFT_BY_ONE_00
void biguintLshiftByOne(inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_RSHIFT_BY_ONE_00
void biguintRshiftByOne(inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_00
#define BIG_UINT_ASSIGN_00
void biguintAssign(inout float dst[BYTE_COUNT], in float src[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT; i++) dst[i] = src[i];
}
#endif

#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
#define BIG_UINT_ASSIGN_IF_TRUE_00
void biguintAssignIfTrue(inout float dst[BYTE_COUNT], in float src[BYTE_COUNT], float f) {
    for (int i = 0; i < BYTE_COUNT; i++) 
        dst[i] = src[i] * ne(f, 1.0)
               + dst[i] * (1.0 - ne(f, 1.0));
}
#endif

#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL_00
float biguintGreaterThanOrEqual(in float a[BYTE_COUNT], in float b[BYTE_COUNT]) {
    float cmp;
    for (int i = BYTE_COUNT - 1; i >= 0; i--)
        cmp += eq(cmp, 0.0) * gt(a[i], b[i])
             - eq(cmp, 0.0) * lt(a[i], b[i]);
    return gt(cmp, -1.0);
}
#endif

#ifndef BIG_UINT_SUB_00
void biguintSub(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_OR_00
void biguintOr(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

void biguintDiv(in float a[BYTE_COUNT], in float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT; i++) c[i] = 0.0;
    float current[BYTE_COUNT], denom[BYTE_COUNT], t1[BYTE_COUNT];
    current[0] = 1.0;
    biguintAssign(denom, b);
    biguintAssign(t1, a);
    float hasOverflowed;
    for (int i = 0; i < 8*BYTE_COUNT; i++) {
        if (biguintGreaterThan(denom, a) == 1.0) break;
        if (denom[BYTE_COUNT-1] >= 128.0) {
            hasOverflowed = 1.0;
            break;
        }
        biguintLshiftByOne(current);
        biguintLshiftByOne(denom);
    }
    if (hasOverflowed == 0.0) {
        biguintRshiftByOne(current);
        biguintRshiftByOne(denom);
    }
    for (int i = 0; i < 8*BYTE_COUNT; i++) {
        float currentIsZero = 1.0;
        for (int j = 0; j < BYTE_COUNT; j++) currentIsZero -= currentIsZero * float(current[j] > 0.0);
        if (currentIsZero == 1.0) break;
        if (biguintGreaterThanOrEqual(t1, denom) == 1.0) {
            biguintSub(t1, denom, t1);
            biguintOr(c, current, c);
        }
        biguintRshiftByOne(current);
        biguintRshiftByOne(denom);
    }
}

#endif