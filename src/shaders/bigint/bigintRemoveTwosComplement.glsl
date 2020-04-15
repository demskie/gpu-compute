#ifndef BIG_INT_REMOVE_TWOS_COMPLEMENT_00
#define BIG_INT_REMOVE_TWOS_COMPLEMENT_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

bool bigintRemoveTwosComplement(inout float a[BYTE_COUNT]) {
    bool negative = bool(a[BYTE_COUNT-1] >= 128.0);
    for (int i = 0; i < BYTE_COUNT; i++) {
        a[i] = a[i] * (1.0 - float(negative))
             + (255.0 - a[i]) * float(negative);
    }
    float carry = float(negative);
    for (int i = 0; i < BYTE_COUNT; i++) {
        carry = float(a[i]+carry > 255.0);
        a[i] = mod(a[i]+carry, 256.0);
    }
    return negative;
}

#endif