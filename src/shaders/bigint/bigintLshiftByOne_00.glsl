#ifndef BIG_INT_LSHIFT_BY_ONE_00
#define BIG_INT_LSHIFT_BY_ONE_00

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

#ifndef BIG_UINT_LSHIFT_BY_ONE_00
void biguintLshiftByOne(in float [BYTE_COUNT]);
#endif

#ifndef BIG_INT_APPLY_TWOS_COMPLEMENT_00
void bigintApplyTwosComplement(inout float [BYTE_COUNT], bool);
#endif

void bigintLshiftByOne(inout float a[BYTE_COUNT]) {
    bool negative = bigintRemoveTwosComplement(a);
    biguintLshiftByOne(a);
    bigintApplyTwosComplement(a, negative);
}

#endif