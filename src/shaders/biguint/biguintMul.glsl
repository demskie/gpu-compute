#ifndef BIG_UINT_MUL
#define BIG_UINT_MUL

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_LSHIFT
void biguintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_ASSIGN
void biguintAssign(inout float [BYTE_COUNT], float);
#endif

void biguintMul(float a[BYTE_COUNT], float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    float nonEmptyBytes, powerOfTwoBit;
    for (int i = 0; i < BYTE_COUNT; i++) {
        nonEmptyBytes += float(b[i] != 0.0);
        powerOfTwoBit = float(i*8+0) * float(b[i] == 1.0)
                      + float(i*8+1) * float(b[i] == 2.0)
                      + float(i*8+2) * float(b[i] == 4.0)
                      + float(i*8+3) * float(b[i] == 8.0)
                      + float(i*8+4) * float(b[i] == 16.0)
                      + float(i*8+5) * float(b[i] == 32.0)
                      + float(i*8+6) * float(b[i] == 64.0)
                      + float(i*8+7) * float(b[i] == 128.0);
    }
    if (nonEmptyBytes == 1.0 && powerOfTwoBit != 0.0) {
        biguintLshift(a, c, powerOfTwoBit);
    } else {
        float product, carry;
        float t1[BYTE_COUNT*2];
        for (int i = 0; i < BYTE_COUNT; i++) {
            for (int j = 0; j < BYTE_COUNT; j++) {
                product = a[i] * b[j] + t1[i+j];
                carry = floor(product / 256.0);
                t1[i+j] = product - carry * 256.0;
                t1[i+j+1] += carry;
            }
        }
        float isOver = 0.0;
        for (int i = BYTE_COUNT; i < 2*BYTE_COUNT; i++) isOver += min(t1[i], 1.0);
        for (int i = 0; i < BYTE_COUNT; i++) c[i] = t1[i] * (1.0 - isOver) + 255.0 * isOver;
    }
}

void biguintMul(float a[BYTE_COUNT], float bf, inout float c[BYTE_COUNT]) {
    float b[BYTE_COUNT];
    biguintAssign(b, bf);
    biguintMul(a, b, c);
}

#endif