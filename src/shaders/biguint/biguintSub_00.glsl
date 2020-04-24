#ifndef BIG_UINT_SUB_00
#define BIG_UINT_SUB_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef FLOAT_LT_00
#define FLOAT_LT_00
float lt(float f1, float f2) {
  return min(sign(f2 - f1), 0.0);
}
#endif

void biguintSub(in float a[BYTE_COUNT], in float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    float borrow, tmp;
    for (int i = 0; i < BYTE_COUNT; i++) {
        tmp = a[i] - b[i] - borrow;
        borrow = lt(tmp, 0.0);
        c[i] = mod(tmp, 256.0); 
    }
}

#endif