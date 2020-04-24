#ifndef BIG_UINT_RSHIFT_00
#define BIG_UINT_RSHIFT_00

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
  return max(sign(f2 - f1), 0.0);
}
#endif

#ifndef FLOAT_GT_00
#define FLOAT_GT_00
float gt(float f1, float f2) {
  return max(sign(f1 - f2), 0.0);
}
#endif

#ifndef FLOAT_GTE_00
#define FLOAT_GTE_00
float gte(float f1, float f2) {
  return 1.0 - max(sign(f2 - f1), 0.0); 
}
#endif

#ifndef BIG_UINT_LSHIFT_WORD_00
#define BIG_UINT_LSHIFT_WORD_00
void biguintLshiftWord(inout float a[BYTE_COUNT], float count) {
    for (int i = BYTE_COUNT - 1; i >= 0; i--) 
        a[i] = a[int(max(float(i)-count, 0.0))]
             * gte(float(i)+count, 0.0);
}
#endif

#ifndef BIG_UINT_LSHIFT_BYTE_00
#define BIG_UINT_LSHIFT_BYTE_00
float biguintLshiftByte(float i, float m) {
    return max(floor(i * eq(m, 0.0)
                   + i * eq(m, 1.0) * 2.0
                   + i * eq(m, 2.0) * 4.0
                   + i * eq(m, 3.0) * 8.0
                   + i * eq(m, 4.0) * 16.0
                   + i * eq(m, 5.0) * 32.0
                   + i * eq(m, 6.0) * 64.0
                   + i * eq(m, 7.0) * 128.0), 255.0);
}
#endif

#ifndef BIG_UINT_RSHIFT_WORD_00
#define BIG_UINT_RSHIFT_WORD_00
void biguintRshiftWord(inout float a[BYTE_COUNT], float count) {
    for (int i = 0; i < BYTE_COUNT; i++) 
        a[i] = a[int(max(float(i)+count, float(BYTE_COUNT) - 1.0))]
             * lt(float(i)+count, float(BYTE_COUNT));
}
#endif

#ifndef BIG_UINT_RSHIFT_BYTE_00
#define BIG_UINT_RSHIFT_BYTE_00
float biguintRshiftByte(float i, float m) {
    return floor(i * eq(m, 0.0)
               + i * eq(m, 1.0) / 2.0
               + i * eq(m, 2.0) / 4.0
               + i * eq(m, 3.0) / 8.0
               + i * eq(m, 4.0) / 16.0
               + i * eq(m, 5.0) / 32.0
               + i * eq(m, 6.0) / 64.0
               + i * eq(m, 7.0) / 128.0);
}
#endif

#ifndef BIG_UINT_OR_BYTE_00
#define BIG_UINT_OR_BYTE_00
float biguintOrByte(float a, float b) {
    float o = max(gte(a, 128.0), gte(b, 128.0)) * 128.0;
    a -= gte(a, 128.0) * 128.0;
    b -= gte(b, 128.0) * 128.0;
    o += max(gte(a, 64.0), gte(b, 64.0)) * 64.0;
    a -= gte(a, 64.0) * 64.0;
    b -= gte(b, 64.0) * 64.0;
    o += max(gte(a, 32.0), gte(b, 32.0)) * 32.0;
    a -= gte(a, 32.0) * 32.0;
    b -= gte(b, 32.0) * 32.0;
    o += max(gte(a, 16.0), gte(b, 16.0)) * 16.0;
    a -= gte(a, 16.0) * 16.0;
    b -= gte(b, 16.0) * 16.0;
    o += max(gte(a, 8.0), gte(b, 8.0)) * 8.0;
    a -= gte(a, 8.0) * 8.0;
    b -= gte(b, 8.0) * 8.0;
    o += max(gte(a, 4.0), gte(b, 4.0)) * 4.0;
    a -= gte(a, 4.0) * 4.0;
    b -= gte(b, 4.0) * 4.0;
    o += max(gte(a, 2.0), gte(b, 2.0)) * 2.0;
    a -= gte(a, 2.0) * 2.0;
    b -= gte(b, 2.0) * 2.0;
    return o + max(gte(a, 1.0), gte(b, 1.0));
}
#endif

#ifndef BIG_UINT_ASSIGN_00
#define BIG_UINT_ASSIGN_00
void biguintAssign(inout float dst[BYTE_COUNT], in float src[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT; i++) dst[i] = src[i];
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

void biguintRshift(in float a[BYTE_COUNT], inout float b[BYTE_COUNT], float count) {
    count = clamp(floor(count), 0.0, float(BYTE_COUNT*8));
    biguintAssign(b, a);
    biguintRshiftWord(b, floor(count / 8.0));
    float bits = mod(count, 8.0);
    float t1[BYTE_COUNT];
    biguintAssign(t1, b);
    for (int i = 0; i < BYTE_COUNT - 1; i++)
        t1[i] = biguintOrByte(biguintRshiftByte(t1[i], bits),
                              biguintLshiftByte(t1[i+1], 8.0-bits));
    t1[BYTE_COUNT-1] = biguintRshiftByte(t1[BYTE_COUNT-1], bits);
    biguintAssignIfTrue(b, t1, gt(bits, 0.0));
}

#endif