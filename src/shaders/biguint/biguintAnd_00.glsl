#ifndef BIG_UINT_AND_00
#define BIG_UINT_AND_00

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

#ifndef FLOAT_NE_00
#define FLOAT_NE_00
float ne(float f1, float f2) {
  return abs(sign(f1 - f2));
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

#ifndef FLOAT_LTE_00
#define FLOAT_LTE_00
float lte(float f1, float f2) {
  return 1.0 - min(sign(f1 - f2), 0.0); 
}
#endif

#ifndef FLOAT_GTE_00
#define FLOAT_GTE_00
float gte(float f1, float f2) {
  return 1.0 - min(sign(f2 - f1), 0.0); 
}
#endif

void biguintAnd(in float a[BYTE_COUNT], in float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT; i++) {
        float o = min(gte(a[i], 128.0), gte(b[i], 128.0)) * 128.0;
        a[i] -= gte(a[i], 128.0) * 128.0;
        b[i] -= gte(b[i], 128.0) * 128.0;
        o += min(gte(a[i], 64.0), gte(b[i], 64.0)) * 64.0;
        a[i] -= gte(a[i], 64.0) * 64.0;
        b[i] -= gte(b[i], 64.0) * 64.0;
        o += min(gte(a[i], 32.0), gte(b[i], 32.0)) * 32.0;
        a[i] -= gte(a[i], 32.0) * 32.0;
        b[i] -= gte(b[i], 32.0) * 32.0;
        o += min(gte(a[i], 16.0), gte(b[i], 16.0)) * 16.0;
        a[i] -= gte(a[i], 16.0) * 16.0;
        b[i] -= gte(b[i], 16.0) * 16.0;
        o += min(gte(a[i], 8.0), gte(b[i], 8.0)) * 8.0;
        a[i] -= gte(a[i], 8.0) * 8.0;
        b[i] -= gte(b[i], 8.0) * 8.0;
        o += min(gte(a[i], 4.0), gte(b[i], 4.0)) * 4.0;
        a[i] -= gte(a[i], 4.0) * 4.0;
        b[i] -= gte(b[i], 4.0) * 4.0;
        o += min(gte(a[i], 2.0), gte(b[i], 2.0)) * 2.0;
        a[i] -= gte(a[i], 2.0) * 2.0;
        b[i] -= gte(b[i], 2.0) * 2.0;
        c[i] = o + min(gte(a[i], 1.0), gte(b[i], 1.0));
    }
}

#endif