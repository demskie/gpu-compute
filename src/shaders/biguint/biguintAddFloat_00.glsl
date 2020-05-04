#ifndef BIG_UINT_ADD_FLOAT_00
#define BIG_UINT_ADD_FLOAT_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_ADD_00
void biguintAdd(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

void biguintAddFloat(float a[BYTE_COUNT], float f, inout float c[BYTE_COUNT]) {
    f = floor(clamp(f, 0.0, 65535.0));
    float b [BYTE_COUNT];
    b[0] = mod(f, 256.0);
    b[1] = floor(f / 256.0);
    biguintAdd(a, b, c);
}

#endif