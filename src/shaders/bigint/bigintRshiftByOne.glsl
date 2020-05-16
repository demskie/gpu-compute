#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

bool bigintRemoveTwosComplement(inout float [BYTE_COUNT]);
void biguintRshiftByOne(float [BYTE_COUNT]);
void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);

void bigintRshiftByOne(inout float a[BYTE_COUNT]) {
    bool negative = bigintRemoveTwosComplement(a);
    biguintRshiftByOne(a);
    bigintApplyTwosComplement(a, negative);
}