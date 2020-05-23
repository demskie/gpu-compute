#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float neq(float, float);
float gte(float, float);

void biguintXor(float a[BYTE_COUNT], float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT; i++) {
        float o = neq(gte(a[i], 128.0), gte(b[i], 128.0)) * 128.0;
        a[i] -= gte(a[i], 128.0) * 128.0;
        b[i] -= gte(b[i], 128.0) * 128.0;
        o += neq(gte(a[i], 64.0), gte(b[i], 64.0)) * 64.0;
        a[i] -= gte(a[i], 64.0) * 64.0;
        b[i] -= gte(b[i], 64.0) * 64.0;
        o += neq(gte(a[i], 32.0), gte(b[i], 32.0)) * 32.0;
        a[i] -= gte(a[i], 32.0) * 32.0;
        b[i] -= gte(b[i], 32.0) * 32.0;
        o += neq(gte(a[i], 16.0), gte(b[i], 16.0)) * 16.0;
        a[i] -= gte(a[i], 16.0) * 16.0;
        b[i] -= gte(b[i], 16.0) * 16.0;
        o += neq(gte(a[i], 8.0), gte(b[i], 8.0)) * 8.0;
        a[i] -= gte(a[i], 8.0) * 8.0;
        b[i] -= gte(b[i], 8.0) * 8.0;
        o += neq(gte(a[i], 4.0), gte(b[i], 4.0)) * 4.0;
        a[i] -= gte(a[i], 4.0) * 4.0;
        b[i] -= gte(b[i], 4.0) * 4.0;
        o += neq(gte(a[i], 2.0), gte(b[i], 2.0)) * 2.0;
        a[i] -= gte(a[i], 2.0) * 2.0;
        b[i] -= gte(b[i], 2.0) * 2.0;
        c[i] = o + neq(gte(a[i], 1.0), gte(b[i], 1.0));
    }
}