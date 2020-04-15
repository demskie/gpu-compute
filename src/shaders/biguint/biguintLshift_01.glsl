#ifndef BIG_UINT_LSHIFT_01
#define BIG_UINT_LSHIFT_01

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintLshift(in float a[BYTE_COUNT], inout float b[BYTE_COUNT], in float c[BYTE_COUNT]) {
    float count = c[0] + c[1] * 256.0;
    float byteCount = floor(count / 8.0);
    for (int i = 0; i < BYTE_COUNT; i++) b[i] = a[i];
    for (int i = 0; i < BYTE_COUNT; i++) {
        for (int j = BYTE_COUNT - 1; j > 0; j--) {
            b[j] = float(byteCount > 0.0) * b[j-1] 
                 + float(byteCount <= 0.0) * b[j];
        }
        b[0] = float(byteCount <= 0.0) * b[0];
        byteCount -= 1.0;
    }
    count = mod(count, 8.0);
    bool bits[BYTE_COUNT*8];
    for (int i = 0; i < BYTE_COUNT; i++) {
        float x = 128.0, v = b[BYTE_COUNT-1-i];
        for (int j = 0; j < 8; j++) {
            bits[i*8+j] = v >= x;
            v -= x * float(v >= x);
            x = floor(x / 2.0);
        }
    }
    for (int i = 0; i < 8; i++) {
        for (int j = 0; j < BYTE_COUNT*8 - 1; j++) bits[j] = bits[j+1];
        bits[BYTE_COUNT*8-1] = false;
        for (int j = 0; j < BYTE_COUNT; j++) {
            float v = float(bits[j*8+0]) * 128.0
                    + float(bits[j*8+1]) * 64.0
                    + float(bits[j*8+2]) * 32.0
                    + float(bits[j*8+3]) * 16.0
                    + float(bits[j*8+4]) * 8.0
                    + float(bits[j*8+5]) * 4.0
                    + float(bits[j*8+6]) * 2.0
                    + float(bits[j*8+7]) * 1.0;
            b[BYTE_COUNT-1-j] = float(float(i) < count) * v
                              + float(float(i) >= count) * b[BYTE_COUNT-1-j];
        }
    }
}

#endif