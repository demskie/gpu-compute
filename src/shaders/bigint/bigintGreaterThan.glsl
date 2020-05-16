#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

bool bigintRemoveTwosComplement(float [BYTE_COUNT]);
void bigintAssign(inout float [BYTE_COUNT], float);

float bigintGreaterThan(float a[BYTE_COUNT], float b[BYTE_COUNT]) {
    float cmp;
    bool aNegative = bigintRemoveTwosComplement(a);
    bool bNegative = bigintRemoveTwosComplement(b);
    cmp += float(aNegative == false && bNegative == true);
    cmp -= float(aNegative == true && bNegative == false);
    for (int i = BYTE_COUNT - 1; i >= 0; i--) {
        cmp += float(cmp == 0.0) * float(a[i] > b[i]);
        cmp -= float(cmp == 0.0) * float(a[i] < b[i]);
    }
    return float(cmp > 0.0);
}

float bigintGreaterThan(float a[BYTE_COUNT], float bf) {
    float b[BYTE_COUNT];
    bigintAssign(b, bf);
    return bigintGreaterThan(a, b);
}