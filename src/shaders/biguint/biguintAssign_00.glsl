#ifndef BIG_UINT_ASSIGN_00
#define BIG_UINT_ASSIGN_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintAssign(inout float dst[BYTE_COUNT], float src[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT; i++) dst[i] = src[i];
}

#endif