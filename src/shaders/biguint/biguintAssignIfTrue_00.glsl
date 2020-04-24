#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
#define BIG_UINT_ASSIGN_IF_TRUE_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef FLOAT_NE_00
#define FLOAT_NE_00
float ne(float f1, float f2) {
  return abs(sign(f1 - f2));
}
#endif

void biguintAssignIfTrue(inout float dst[BYTE_COUNT], in float src[BYTE_COUNT], float f) {
    for (int i = 0; i < BYTE_COUNT; i++) 
        dst[i] = src[i] * ne(f, 1.0)
               + dst[i] * (1.0 - ne(f, 1.0));
}

#endif