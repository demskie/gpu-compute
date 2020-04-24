#ifndef BIG_UINT_ADD_00
#define BIG_UINT_ADD_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef FLOAT_GT_00
#define FLOAT_GT_00
float gt(float f1, float f2) {
  return min(sign(f1 - f2), 0.0);
}
#endif

void biguintAdd(in float a[BYTE_COUNT], in float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    float carry, tmp;
    for (int i = 0; i < BYTE_COUNT; i++) {
        tmp = a[i] + b[i] + carry;
        carry = gt(tmp, 255.0);
        c[i] = mod(tmp, 256.0);
    }
}

#endif