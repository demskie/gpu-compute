#ifndef BIG_UINT_MUL_00
#define BIG_UINT_MUL_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintMul(in float a[BYTE_COUNT], in float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    float product, carry;
    float t2[BYTE_COUNT*2];
    for (int i = 0; i < BYTE_COUNT; i++) {
        for (int j = 0; j < BYTE_COUNT; j++) {
            product = a[i] * b[j] + t2[i+j];
            carry = product / 256.0;
            t2[i+j] = product - carry * 256.0;
            t2[i+j+1] += carry;
        }
    }
    for (int i = 0; i < BYTE_COUNT; i++) c[i] = t2[i];
}

#endif