#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintXor(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);

void bigintXor(float a[BYTE_COUNT], float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    biguintXor(a, b, c);
}