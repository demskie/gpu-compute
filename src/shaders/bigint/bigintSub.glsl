#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void bigintAssign(inout float [BYTE_COUNT], float);

void bigintSub(float a[BYTE_COUNT], float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    biguintSub(a, b, c);
}

void bigintSub(float a[BYTE_COUNT], float bf, inout float c[BYTE_COUNT]) {
    float b[BYTE_COUNT];
    bigintAssign(b, bf);
    bigintSub(a, b, c);
}