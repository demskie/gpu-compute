#ifndef BIG_INT_ABS_00
#define BIG_INT_ABS_00

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

#ifndef BIG_INT_APPLY_TWOS_COMPLEMENT_00
void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);
#endif

void bigintAbs(inout float a[BYTE_COUNT]) {
    bigintRemoveTwosComplement(a);
    bigintApplyTwosComplement(a, false);
}

#endif