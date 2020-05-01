#ifndef BIG_UINT_DIV_00
#define BIG_UINT_DIV_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_GREATER_THAN_00
float biguintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_LSHIFT_BY_ONE_00
void biguintLshiftByOne(inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_RSHIFT_BY_ONE_00
void biguintRshiftByOne(inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_00
void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL_00
float biguintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_SUB_00
void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_OR_00
void biguintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_LSHIFT_BYTE_00
float biguintLshiftByte(float, float);
#endif

#ifndef BIG_UINT_RSHIFT_BYTE_00
float biguintRshiftByte(float, float);
#endif

#ifndef BIG_UINT_OR_BYTE_00
float biguintOrByte(float, float);
#endif

void biguintDiv(float a[BYTE_COUNT], float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT; i++) c[i] = 0.0;
    float current[BYTE_COUNT], denom[BYTE_COUNT], t1[BYTE_COUNT];
    current[0] = 1.0;
    biguintAssign(denom, b);
    biguintAssign(t1, a);
    bool overflow;
    for (int i = 0; i < 8*BYTE_COUNT; i++) {
        if (biguintGreaterThan(denom, a) == 1.0) {
            break;
        } 
        if (denom[BYTE_COUNT-1] >= 128.0) {
            overflow = true;
            break;
        }
        biguintLshiftByOne(current);
        biguintLshiftByOne(denom);
    }
    if (!overflow) {
        biguintRshiftByOne(denom);
        biguintRshiftByOne(current);
    }
    for (int i = 0; i < 8*BYTE_COUNT; i++) {
        bool isZero = true;
        for (int j = 0; j < BYTE_COUNT; j++) {
            if (current[j] > 0.0) {
                isZero = false;
            }
        }
        if (isZero) {
            break;
        }
        if (biguintGreaterThanOrEqual(t1, denom) == 1.0) {
            biguintSub(t1, denom, t1);
            biguintOr(c, current, c);
        }
        biguintRshiftByOne(current);
        biguintRshiftByOne(denom);
    }
}

#endif