#ifndef BIG_UINT_POW_00
#define BIG_UINT_POW_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_SUB_00
void biguintSub(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_MUL_00
void biguintMul(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef FLOAT_NE_00
#define FLOAT_NE_00
float ne(float f1, float f2) {
  return abs(sign(f1 - f2));
}
#endif

#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
#define BIG_UINT_ASSIGN_IF_TRUE_00
void biguintAssignIfTrue(inout float dst[BYTE_COUNT], in float src[BYTE_COUNT], float f) {
    for (int i = 0; i < BYTE_COUNT; i++) 
        dst[i] = src[i] * ne(f, 1.0)
               + dst[i] * (1.0 - ne(f, 1.0));
}
#endif

void biguintPow(in float a[BYTE_COUNT], in float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    float t1[BYTE_COUNT], t2[BYTE_COUNT], one[BYTE_COUNT];
    for (int i = 0; i < BYTE_COUNT; i++) t1[i] = a[i];
    for (int i = 0; i < BYTE_COUNT; i++) t2[i] = b[i];
    one[0] = 1.0;
    biguintSub(t2, one, t2);
    float bIsZero = 1.0;
    for (int i = 0; i < BYTE_COUNT; i++) bIsZero -= bIsZero * float(b[i] > 0.0);
    if (bIsZero == 0.0) {
        for (int i = 0; i < 8 * BYTE_COUNT; i++) {
            float t2IsZero = 1.0;
            for (int j = 0; j < BYTE_COUNT; j++) t2IsZero -= t2IsZero * float(t2[j] > 0.0);
            if (t2IsZero == 1.0) break;
            biguintMul(t1, a, c);
            biguintSub(t2, one, t2);
            for (int j = 0; j < BYTE_COUNT; j++) t1[j] = c[j];
        }
    }
    for (int i = 0; i < BYTE_COUNT; i++) c[i] = t1[i];
    biguintAssignIfTrue(c, one, bIsZero);
}

#endif