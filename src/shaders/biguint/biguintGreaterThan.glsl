#ifndef BIG_UINT_GREATER_THAN
#define BIG_UINT_GREATER_THAN

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_ASSIGN
void biguintAssign(inout float [BYTE_COUNT], float);
#endif

float biguintGreaterThan(float a[BYTE_COUNT], float b[BYTE_COUNT]) {
    float cmp;
    for (int i = BYTE_COUNT - 1; i >= 0; i--)
        cmp += float(cmp == 0.0) * float(a[i] > b[i])
             - float(cmp == 0.0) * float(a[i] < b[i]);
    return float(cmp == 1.0);
}

float biguintGreaterThan(float a[BYTE_COUNT], float bf) {
    float b[BYTE_COUNT];
    biguintAssign(b, bf);
    return biguintGreaterThan(a, b);
}

#endif