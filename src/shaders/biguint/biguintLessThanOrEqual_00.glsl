#ifndef BIG_UINT_LESS_THAN_OR_EQUAL_00
#define BIG_UINT_LESS_THAN_OR_EQUAL_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

bool biguintLessThanOrEqual(in float a[BYTE_COUNT], in float b[BYTE_COUNT]) {
    float cmp;
    for (int i = BYTE_COUNT - 1; i >= 0; i--) {
        cmp += float(cmp == 0.0) * float(a[i] > b[i]);
        cmp -= float(cmp == 0.0) * float(a[i] < b[i]);
    }
    return cmp <= 0.0;
}

#endif