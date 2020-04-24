#ifndef BIG_UINT_LSHIFT_BY_ONE_00
#define BIG_UINT_LSHIFT_BY_ONE_00

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

#ifndef FLOAT_GTE_00
#define FLOAT_GTE_00
float gte(float f1, float f2) {
  return 1.0 - max(sign(f2 - f1), 0.0); 
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

void biguintLshiftByOne(inout float a[BYTE_COUNT]) {
    for (int i = BYTE_COUNT - 1; i > 0; i--) 
        a[i] = biguintOrByte(biguintLshiftByte(a[i], 1.0), 
                             biguintRshiftByte(a[i-1], 8.0-1.0));
    a[0] = biguintLshiftByte(a[0], 1.0);
}

#endif