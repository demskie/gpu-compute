#ifndef BIG_UINT_ASSIGN_FLOAT_IF_TRUE_00
#define BIG_UINT_ASSIGN_FLOAT_IF_TRUE_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintAssignFloatIfTrue(inout float dst[BYTE_COUNT], float f, float b) {
    f = clamp(floor(f), 0.0, 65535.0);
    float src[BYTE_COUNT];
    src[0] = mod(f, 256.0);
    src[1] = floor(f / 256.0);
    for (int i = 0; i < BYTE_COUNT; i++) 
        dst[i] = src[i] * float(b != 0.0)
               + dst[i] * float(b == 0.0);
}

#endif