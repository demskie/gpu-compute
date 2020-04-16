#ifndef BIG_INT_RSHIFT_00
#define BIG_INT_RSHIFT_00

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

#ifndef BIG_UINT_RSHIFT_00
void biguintRshift(in float [BYTE_COUNT], inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_INT_APPLY_TWOS_COMPLEMENT_00
void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);
#endif

void bigintRshift(in float a[BYTE_COUNT], inout float b[BYTE_COUNT], float f) {
    bool negative = bigintRemoveTwosComplement(a);
    biguintRshift(a, b, f);
    bigintApplyTwosComplement(b, negative);
}

#endif