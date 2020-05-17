#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintAdd(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);

void bigintApplyTwosComplement(inout float a[BYTE_COUNT], float negative) {
    a[BYTE_COUNT-1] -= float(a[BYTE_COUNT-1] >= 128.0) * 128.0;
    for (int i = 0; i < BYTE_COUNT; i++) {
        a[i] = a[i] * (1.0 - negative)
             + (255.0 - a[i]) * negative;
    }
    biguintAdd(a, negative, a);
}

void bigintApplyTwosComplement(inout float a[BYTE_COUNT], bool negative) {
    bigintApplyTwosComplement(a, float(negative));
}