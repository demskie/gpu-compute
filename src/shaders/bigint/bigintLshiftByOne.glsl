#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

bool bigintRemoveTwosComplement(inout float [BYTE_COUNT]);
void biguintLshiftByOne(float [BYTE_COUNT]);
void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);

void bigintLshiftByOne(inout float a[BYTE_COUNT]) {
    bool negative = bigintRemoveTwosComplement(a);
    biguintLshiftByOne(a);
    bigintApplyTwosComplement(a, negative);
}