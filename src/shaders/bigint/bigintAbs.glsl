#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

bool bigintRemoveTwosComplement(inout float [BYTE_COUNT]);
void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);

void bigintAbs(inout float a[BYTE_COUNT]) {
    bigintRemoveTwosComplement(a);
    bigintApplyTwosComplement(a, false);
}