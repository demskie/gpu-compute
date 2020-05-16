#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintOr(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);

void bigintOr(float a[BYTE_COUNT], float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    biguintOr(a, b, c);
}