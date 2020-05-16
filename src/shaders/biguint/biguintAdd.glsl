#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintAssign(inout float [BYTE_COUNT], float);

void biguintAdd(float a[BYTE_COUNT], float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    float carry, tmp;
    for (int i = 0; i < BYTE_COUNT; i++) {
        tmp = a[i] + b[i] + carry;
        carry = floor(tmp / 256.0);
        c[i] = mod(tmp, 256.0);
    }
}

void biguintAdd(float a[BYTE_COUNT], float bf, inout float c[BYTE_COUNT]) {
    float b[BYTE_COUNT];
    biguintAssign(b, bf);
    biguintAdd(a, b, c);
}