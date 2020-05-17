#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float bigintLessThan(float [BYTE_COUNT], float);
void bigintAbs(inout float [BYTE_COUNT]);
bool bigintRemoveTwosComplement(inout float [BYTE_COUNT]);
void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);
void bigintAssign(inout float [BYTE_COUNT], float);

void bigintMul(float a[BYTE_COUNT], float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    bool aNegative = bigintRemoveTwosComplement(a);
    bool bNegative = bigintRemoveTwosComplement(b);
    biguintMul(a, b, c);
    bigintApplyTwosComplement(c, aNegative != bNegative);
}

void bigintMul(float a[BYTE_COUNT], float bf, inout float c[BYTE_COUNT]) {
    float b[BYTE_COUNT];
    bigintAssign(b, bf);
    bigintMul(a, b, c);
}