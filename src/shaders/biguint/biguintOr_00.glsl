#ifndef BIG_UINT_OR_00
#define BIG_UINT_OR_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintOr(in float a[BYTE_COUNT], in float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT; i++) {
        float o = 0.0, x = 128.0;
        float v1 = a[i], v2 = b[i];
        for (int j = 0; j < 8; j++) {
            o += x * max(float(v1 >= x), float(v2 >= x));
            v1 -= x * float(v1 >= x);
            v2 -= x * float(v2 >= x);
            x /= 2.0;
        }
        c[i] = o;
    }
}

#endif