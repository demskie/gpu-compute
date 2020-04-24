#ifndef BIG_UINT_SQRT_00
#define BIG_UINT_SQRT_00

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

#ifndef FLOAT_LT_00
#define FLOAT_LT_00
float lt(float f1, float f2) {
  return min(sign(f2 - f1), 0.0);
}
#endif

#ifndef FLOAT_GT_00
#define FLOAT_GT_00
float gt(float f1, float f2) {
  return min(sign(f1 - f2), 0.0);
}
#endif

#ifndef BIG_UINT_RSHIFT_00
void biguintRshift(in float [BYTE_COUNT], inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_ADD_00
void biguintAdd(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_LESS_THAN_OR_EQUAL_00
#define BIG_UINT_LESS_THAN_OR_EQUAL_00
float biguintLessThanOrEqual(in float a[BYTE_COUNT], in float b[BYTE_COUNT]) {
    float cmp;
    for (int i = BYTE_COUNT - 1; i >= 0; i--)
        cmp += eq(cmp, 0.0) * gt(a[i], b[i])
             - eq(cmp, 0.0) * lt(a[i], b[i]);
    return lt(cmp, 1.0);
}
#endif

#ifndef BIG_UINT_MUL_00
void biguintMul(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
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

#ifndef BIG_UINT_SUB_00
void biguintSub(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef FLOAT_NE_00
#define FLOAT_NE_00
float ne(float f1, float f2) {
  return abs(sign(f1 - f2));
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

#ifndef BIG_UINT_RSHIFT_BY_ONE_00
void biguintRshiftByOne(inout float [BYTE_COUNT]);
#endif

void biguintSqrt(in float a[BYTE_COUNT], inout float b[BYTE_COUNT]) {
    float low[BYTE_COUNT], high[BYTE_COUNT], mid[BYTE_COUNT], t1[BYTE_COUNT], one[BYTE_COUNT];
    for (int i = 0; i < BYTE_COUNT; i++) high[i] = a[i];
    biguintRshift(high, mid, 1.0);
    one[0] = 1.0;
    biguintAdd(mid, one, mid);
    for (int i = 0; i < 8 * BYTE_COUNT; i++) {
        if (biguintLessThanOrEqual(high, low) == 1.0) break;
        biguintMul(mid, mid, t1);
        float isGreaterThan = biguintGreaterThan(t1, a);
        for (int j = 0; j < BYTE_COUNT; j++) t1[j] = mid[j];
        biguintSub(t1, one, t1);
        biguintAssignIfTrue(high, t1, isGreaterThan);
		biguintAssignIfTrue(low, mid, 1.0 - isGreaterThan);
		biguintSub(high, low, mid);
        biguintRshiftByOne(mid);
        biguintAdd(low, mid, mid);
        biguintAdd(mid, one, mid);
    }
    for (int i = 0; i < BYTE_COUNT; i++) b[i] = low[i];
}

#endif