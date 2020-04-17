#ifndef BIG_UINT_DIV_00
#define BIG_UINT_DIV_00

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

#ifndef BIG_UINT_GREATER_THAN_00
bool biguintGreaterThan(in float [BYTE_COUNT], in float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_LSHIFT_BY_ONE_00
void biguintLshiftByOne(inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_RSHIFT_BY_ONE_00
void biguintRshiftByOne(inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
void biguintAssignIfTrue(inout float [BYTE_COUNT], in float [BYTE_COUNT], bool);
#endif

#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL_00
bool biguintGreaterThanOrEqual(in float [BYTE_COUNT], in float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_SUB_00
void biguintSub(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_OR_00
void biguintOr(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

void biguintDiv(in float a[BYTE_COUNT], in float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT; i++) c[i] = 0.0;
    float current[BYTE_COUNT], denom[BYTE_COUNT], t1[BYTE_COUNT], t2[BYTE_COUNT], t3[BYTE_COUNT];
    current[0] = 1.0;
    for (int i = 0; i < BYTE_COUNT; i++) denom[i] = b[i];
    for (int i = 0; i < BYTE_COUNT; i++) t1[i] = a[i];
    bool hasOverflowed;
    for (int i = 0; i < 8*BYTE_COUNT; i++) {
        if (biguintGreaterThan(denom, a)) break;
        if (denom[BYTE_COUNT-1] >= 128.0) {
            hasOverflowed = true;
            break;
        }
        biguintLshiftByOne(current);
        biguintLshiftByOne(denom);
    }
    for (int i = 0; i < BYTE_COUNT; i++) t2[i] = current[i];
    for (int i = 0; i < BYTE_COUNT; i++) t3[i] = denom[i];
    biguintRshiftByOne(current);
    biguintRshiftByOne(denom);
    biguintAssignIfTrue(current, t2, hasOverflowed == false);
    biguintAssignIfTrue(denom, t3, hasOverflowed == false);
    for (int i = 0; i < 8*BYTE_COUNT; i++) {
        float currentIsZero = 1.0;
        for (int j = 0; j < BYTE_COUNT; j++) currentIsZero -= currentIsZero * float(current[j] > 0.0);
        if (currentIsZero == 1.0) break;
        bool shouldModify = biguintGreaterThanOrEqual(t1, denom);
        for (int j = 0; j < BYTE_COUNT; j++) t2[i] = t1[i];
        for (int j = 0; j < BYTE_COUNT; j++) t3[i] = c[i];
        biguintSub(t2, denom, t2);
        biguintOr(t3, current, t3);
        biguintAssignIfTrue(t1, t2, shouldModify);
        biguintAssignIfTrue(c, t3, shouldModify);
        biguintRshiftByOne(current);
        biguintRshiftByOne(denom);
    }
}

#endif