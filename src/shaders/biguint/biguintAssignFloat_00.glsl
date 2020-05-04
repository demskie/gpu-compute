#ifndef BIG_UINT_ASSIGN_FLOAT_00
#define BIG_UINT_ASSIGN_FLOAT_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintAssignFloat(inout float dst[BYTE_COUNT], float f) {
    f = clamp(floor(f), 0.0, 65535.0);
    dst[0] = mod(f, 256.0);
    dst[1] = floor(f / 256.0);
    for (int i = 2; i < BYTE_COUNT; i++) dst[i] = 0.0;
}

#endif