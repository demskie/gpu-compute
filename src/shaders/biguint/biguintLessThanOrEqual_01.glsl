#ifndef BIG_UINT_LESS_THAN_OR_EQUAL_01
#define BIG_UINT_LESS_THAN_OR_EQUAL_01

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

bool biguintLessThanOrEqual(in float a[BYTE_COUNT], float f) {
    float b[BYTE_COUNT];
    b[0] = mod(f, 256.0);
    b[1] = floor(f / 256.0);
    float cmp;
    for (int i = BYTE_COUNT - 1; i >= 0; i--) {
        cmp += float(cmp == 0.0) * float(a[i] > b[i]);
        cmp -= float(cmp == 0.0) * float(a[i] < b[i]);
    }
    return cmp <= 0.0;
}

#endif