#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float biguintLshiftByte(float i, float m) {
    return mod(floor(i * float(m == 0.0)
                   + i * float(m == 1.0) * 2.0
                   + i * float(m == 2.0) * 4.0
                   + i * float(m == 3.0) * 8.0
                   + i * float(m == 4.0) * 16.0
                   + i * float(m == 5.0) * 32.0
                   + i * float(m == 6.0) * 64.0
                   + i * float(m == 7.0) * 128.0), 256.0);
}