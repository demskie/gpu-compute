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

bool bigintRemoveTwosComplement(inout float [BYTE_COUNT]);
void bigintAssign(inout float [BYTE_COUNT], float);

float bigintEquals(float a[BYTE_COUNT], float b[BYTE_COUNT]) {
    float cmp;
    bool aNegative = bigintRemoveTwosComplement(a);
    bool bNegative = bigintRemoveTwosComplement(b);
    cmp += float(aNegative == false && bNegative == true);
    cmp -= float(aNegative == true && bNegative == false);
    for (int i = BYTE_COUNT - 1; i >= 0; i--)
        cmp += eq(cmp, 0.0) * gt(floor(a[i]), floor(b[i]))
             - eq(cmp, 0.0) * lt(floor(a[i]), floor(b[i]));
    return eq(cmp, 0.0);
}

float bigintEquals(float a[BYTE_COUNT], float bf) {
    float b[BYTE_COUNT];
    bigintAssign(b, bf);
    return bigintEquals(a, b);
}