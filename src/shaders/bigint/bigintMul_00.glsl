#ifndef BIG_INT_MUL_00
#define BIG_INT_MUL_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_INT_REMOVE_TWOS_COMPLEMENT_00
bool bigintRemoveTwosComplement(inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_MUL_00
void biguintMul(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_INT_APPLY_TWOS_COMPLEMENT_00
void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);
#endif

void bigintMul(in float a[BYTE_COUNT], in float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    bool aNegative = bigintRemoveTwosComplement(a);
    bool bNegative = bigintRemoveTwosComplement(b);
    biguintMul(a, b, c);
    bigintApplyTwosComplement(c, aNegative != bNegative);
}

#endif