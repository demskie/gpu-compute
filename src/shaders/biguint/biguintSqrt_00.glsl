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
void biguintRshift(in float [BYTE_COUNT], inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_ADD_00
void biguintAdd(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_LESS_THAN_OR_EQUAL_00
bool biguintLessThanOrEqual(in float [BYTE_COUNT], in float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_MUL_00
void biguintMul(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_GREATER_THAN_00
bool biguintGreaterThan(in float [BYTE_COUNT], in float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_SUB_00
void biguintSub(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
void biguintAssignIfTrue(in float [BYTE_COUNT], inout float [BYTE_COUNT], bool);
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
        if (biguintLessThanOrEqual(high, low)) break;
        biguintMul(mid, mid, t1);
        bool isGreaterThan = biguintGreaterThan(t1, a);
        for (int j = 0; j < BYTE_COUNT; j++) t1[j] = mid[j];
        biguintSub(t1, one, t1);
        biguintAssignIfTrue(high, t1, isGreaterThan);
		biguintAssignIfTrue(low, mid, !isGreaterThan);
		biguintSub(high, low, mid);
        biguintRshiftByOne(mid);
        biguintAdd(low, mid, mid);
        biguintAdd(mid, one, mid);
    }
    for (int i = 0; i < BYTE_COUNT; i++) b[i] = low[i];
}

#endif