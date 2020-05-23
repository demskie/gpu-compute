#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float gt(float, float);
float lt(float, float);
float eq(float, float);

void biguintAssign(inout float [BYTE_COUNT], float);

float biguintLessThan(float a[BYTE_COUNT], float b[BYTE_COUNT]) {
    float cmp;
    for (int i = BYTE_COUNT - 1; i >= 0; i--)
        cmp += eq(cmp, 0.0) * gt(floor(a[i]), floor(b[i]))
             - eq(cmp, 0.0) * lt(floor(a[i]), floor(b[i]));
    return eq(cmp, -1.0);
}

float biguintLessThan(float a[BYTE_COUNT], float bf) {
    float b[BYTE_COUNT];
    biguintAssign(b, bf);
    return biguintLessThan(a, b);
}