#ifndef BIG_UINT_GREATER_THAN_OR_EQUAL_00
#define BIG_UINT_GREATER_THAN_OR_EQUAL_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float biguintGreaterThanOrEqual(float a[BYTE_COUNT], float b[BYTE_COUNT]) {
    float cmp;
    for (int i = BYTE_COUNT - 1; i >= 0; i--)
        cmp += float(cmp == 0.0) * float(a[i] > b[i])
             - float(cmp == 0.0) * float(a[i] < b[i]);
    return float(cmp > -1.0);
}

#endif