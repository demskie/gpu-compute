#ifndef BIG_UINT_LSHIFT_BY_ONE_00
#define BIG_UINT_LSHIFT_BY_ONE_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintLshiftByOne(inout float a[BYTE_COUNT]) {
    bool bits[BYTE_COUNT*8];
    for (int i = 0; i < BYTE_COUNT; i++) {
        float x = 128.0, v = a[BYTE_COUNT-1-i];
        for (int j = 0; j < 8; j++) {
            bits[i*8+j] = v >= x;
            v -= x * float(v >= x);
            x = floor(x / 2.0);
        }
    }
    for (int i = 0; i < BYTE_COUNT*8 - 1; i++) bits[i] = bits[i+1];
    bits[BYTE_COUNT*8-1] = false;
    for (int i = 0; i < BYTE_COUNT; i++) {
        a[BYTE_COUNT-1-i] = float(bits[i*8+0]) * 128.0
                          + float(bits[i*8+1]) * 64.0
                          + float(bits[i*8+2]) * 32.0
                          + float(bits[i*8+3]) * 16.0
                          + float(bits[i*8+4]) * 8.0
                          + float(bits[i*8+5]) * 4.0
                          + float(bits[i*8+6]) * 2.0
                          + float(bits[i*8+7]) * 1.0;
    }
}

#endif