#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float eq(float, float);

float biguintLshiftByte(float i, float m) {
    return mod(floor(i * eq(m, 0.0)
                   + i * eq(m, 1.0) * 2.0
                   + i * eq(m, 2.0) * 4.0
                   + i * eq(m, 3.0) * 8.0
                   + i * eq(m, 4.0) * 16.0
                   + i * eq(m, 5.0) * 32.0
                   + i * eq(m, 6.0) * 64.0
                   + i * eq(m, 7.0) * 128.0), 256.0);
}