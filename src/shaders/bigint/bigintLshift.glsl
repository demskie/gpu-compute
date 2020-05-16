#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

bool bigintRemoveTwosComplement(inout float [BYTE_COUNT]);
void biguintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);
void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);

void bigintLshift(float a[BYTE_COUNT], inout float b[BYTE_COUNT], float f) {
    bool negative = bigintRemoveTwosComplement(a);
    biguintLshift(a, b, f);
    bigintApplyTwosComplement(b, negative);
}