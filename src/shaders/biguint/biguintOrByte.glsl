#ifndef BIG_UINT_OR_BYTE
#define BIG_UINT_OR_BYTE

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef FLOAT_GTE
#define FLOAT_GTE
float gte(float f1, float f2) {
  return 1.0 - max(sign(f2 - f1), 0.0);
}
#endif

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