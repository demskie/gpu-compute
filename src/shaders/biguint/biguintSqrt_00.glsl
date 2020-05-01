#ifndef BIG_UINT_SQRT_00
#define BIG_UINT_SQRT_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_RSHIFT_00
void biguintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_ADD_00
void biguintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_LESS_THAN_00
float biguintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_LESS_THAN_OR_EQUAL_00
float biguintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_GREATER_THAN_00
float biguintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL_00
float biguintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_MUL_00
void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_SUB_00
void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_00
void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_RSHIFT_BY_ONE_00
void biguintRshiftByOne(inout float [BYTE_COUNT]);
#endif

void biguintSqrt(float a[BYTE_COUNT], inout float b[BYTE_COUNT]) {
    float low[BYTE_COUNT], high[BYTE_COUNT], mid[BYTE_COUNT], t1[BYTE_COUNT], one[BYTE_COUNT];
    one[0] = 1.0;
    biguintAssign(high, a);
    biguintRshift(high, mid, 1.0);
    biguintAdd(mid, one, mid);
    for (int i = 0; i < BYTE_COUNT * 8; i++) {
        if (biguintLessThanOrEqual(high, low) == 1.0) break;
        biguintMul(mid, mid, t1);
        float isGreaterThan = biguintGreaterThan(t1, a);
        biguintAssign(t1, mid);
        biguintSub(t1, one, t1);
        biguintAssignIfTrue(high, t1, isGreaterThan);
		biguintAssignIfTrue(low, mid, 1.0 - isGreaterThan);
		biguintSub(high, low, mid);
        biguintRshiftByOne(mid);
        biguintAdd(low, mid, mid);
        biguintAdd(mid, one, mid);
    }
    biguintAssign(b, low);
}

#endif