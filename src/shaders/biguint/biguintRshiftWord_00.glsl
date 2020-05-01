#ifndef BIG_UINT_RSHIFT_WORD_00
#define BIG_UINT_RSHIFT_WORD_00

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
  return max(sign(f2 - f1), 0.0);
}
#endif

void biguintRshiftWord(inout float a[BYTE_COUNT], float count) {
    for (int i = 0; i < BYTE_COUNT; i++) 
        a[i] = a[int(min(float(i)+count, float(BYTE_COUNT) - 1.0))]
             * lt(float(i)+count, float(BYTE_COUNT));
}
#endif