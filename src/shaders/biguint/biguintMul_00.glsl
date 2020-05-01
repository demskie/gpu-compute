#ifndef BIG_UINT_MUL_00
#define BIG_UINT_MUL_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintMul(float a[BYTE_COUNT], float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    float product, carry;
    float t1[BYTE_COUNT*2];
    for (int i = 0; i < BYTE_COUNT; i++) {
        for (int j = 0; j < BYTE_COUNT; j++) {
            product = a[i] * b[j] + t1[i+j];
            carry = floor(product / 256.0);
            t1[i+j] = product - carry * 256.0;
            t1[i+j+1] += carry;
        }
    }
    float isOver = 0.0;
    for (int i = BYTE_COUNT; i < 2*BYTE_COUNT; i++) isOver += min(t1[i], 1.0);
    for (int i = 0; i < BYTE_COUNT; i++) c[i] = t1[i] * (1.0 - isOver) + 255.0 * isOver;
}

#endif