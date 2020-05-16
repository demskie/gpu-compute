#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef FLOAT_LTZ
#define FLOAT_LTZ
float ltz(float f) {
  return abs(min(sign(f), 0.0));
}
#endif

void biguintAssign(inout float [BYTE_COUNT], float);

void biguintSub(float a[BYTE_COUNT], float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    float borrow, tmp;
    for (int i = 0; i < BYTE_COUNT; i++) {
        tmp = a[i] - b[i] - borrow;
        borrow = ltz(tmp);
        c[i] = mod(tmp, 256.0); 
    }
}

void biguintSub(float a[BYTE_COUNT], float bf, inout float c[BYTE_COUNT]) {
    float b[BYTE_COUNT];
    biguintAssign(b, bf);
    biguintSub(a, b, c);
}