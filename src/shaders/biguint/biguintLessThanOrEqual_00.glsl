#ifndef BIG_UINT_LESS_THAN_OR_EQUAL_00
#define BIG_UINT_LESS_THAN_OR_EQUAL_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef FLOAT_EQ_00
#define FLOAT_EQ_00
float eq(float f1, float f2) {
  return 1.0 - abs(sign(f1 - f2));
}
#endif

#ifndef FLOAT_LT_00
#define FLOAT_LT_00
float lt(float f1, float f2) {
  return min(sign(f2 - f1), 0.0);
}
#endif

#ifndef FLOAT_GT_00
#define FLOAT_GT_00
float gt(float f1, float f2) {
  return min(sign(f1 - f2), 0.0);
}
#endif

float biguintLessThanOrEqual(in float a[BYTE_COUNT], in float b[BYTE_COUNT]) {
    float cmp;
    for (int i = BYTE_COUNT - 1; i >= 0; i--)
        cmp += eq(cmp, 0.0) * gt(a[i], b[i])
             - eq(cmp, 0.0) * lt(a[i], b[i]);
    return lt(cmp, 1.0);
}

#endif