#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);
void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);

void biguintPow(float a[BYTE_COUNT], float bf, inout float c[BYTE_COUNT]) {
    bf = max(floor(bf), 0.0);
    c[0] = 1.0;
    for (int i = 1; i < BYTE_COUNT; i++) c[i] = 0.0;
    biguintAssignIfTrue(c, a, float(bf != 0.0));
    for (int i = 0; i < 65536; i++) {
        if (bf <= 1.0) break;
        biguintMul(c, a, c);
        bf -= 1.0;
    }
}