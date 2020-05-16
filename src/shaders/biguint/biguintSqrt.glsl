#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);
void biguintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintAdd(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);
float biguintLessThan(float [BYTE_COUNT], float [BYTE_COUNT]);
float biguintLessThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);
float biguintGreaterThan(float [BYTE_COUNT], float [BYTE_COUNT]);
float biguintGreaterThanOrEqual(float [BYTE_COUNT], float [BYTE_COUNT]);
void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintSub(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);
void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);
void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);
void biguintRshiftByOne(inout float [BYTE_COUNT]);

void biguintSqrt(inout float a[BYTE_COUNT]) {
    float low[BYTE_COUNT], high[BYTE_COUNT], mid[BYTE_COUNT], t1[BYTE_COUNT];
    biguintAssign(high, a);
    biguintRshift(high, mid, 1.0);
    biguintAdd(mid, 1.0, mid);
    for (int i = 0; i < BYTE_COUNT * 8; i++) {
        if (biguintLessThanOrEqual(high, low) == 1.0) break;
        biguintMul(mid, mid, t1);
        float isGreaterThan = biguintGreaterThan(t1, a);
        biguintAssign(t1, mid);
        biguintSub(t1, 1.0, t1);
        biguintAssignIfTrue(high, t1, isGreaterThan);
		biguintAssignIfTrue(low, mid, 1.0 - isGreaterThan);
		biguintSub(high, low, mid);
        biguintRshiftByOne(mid);
        biguintAdd(low, mid, mid);
        biguintAdd(mid, 1.0, mid);
    }
    biguintAssign(a, low);
}

void biguintSqrt(float a[BYTE_COUNT], inout float b[BYTE_COUNT]) {
    biguintAssign(b, a);
    biguintSqrt(b);
}