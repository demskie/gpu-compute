#ifndef BIG_UINT_ADD_01
#define BIG_UINT_ADD_01

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintAdd(in float a[BYTE_COUNT], float b, inout float c[BYTE_COUNT]) {
    float t[BYTE_COUNT];
    t[0] = mod(b, 256.0);
    t[1] = floor(b / 256.0);
    float carry, tmp;
    for (int i = 0; i < BYTE_COUNT; i++) {
        tmp = a[i] + t[i] + carry;
        carry = float(tmp > 255.0);
        c[i] = mod(tmp, 256.0);
    }
}

#endif