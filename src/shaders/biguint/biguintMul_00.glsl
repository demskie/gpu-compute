#ifndef BIG_UINT_MUL_00
#define BIG_UINT_MUL_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
void biguintAssignIfTrue(inout float [BYTE_COUNT], in float [BYTE_COUNT], bool);
#endif

#ifndef BIG_UINT_LSHIFT_00
void biguintLshift(in float [BYTE_COUNT], inout float [BYTE_COUNT], float);
#endif

void biguintMul(in float a[BYTE_COUNT], in float b[BYTE_COUNT], inout float c[BYTE_COUNT]) {
    float aStop, bStop;
    for (int i = BYTE_COUNT - 1; i > 0; i--) {
        aStop += float(aStop == 0.0) * float(a[i] > 0.0) * float(i);
        bStop += float(bStop == 0.0) * float(b[i] > 0.0) * float(i);
    }
    float t1[BYTE_COUNT];
    for (int i = 0; i < BYTE_COUNT; i++) t1[i] = a[i];
    biguintAssignIfTrue(a, b, aStop < bStop);
    biguintAssignIfTrue(b, t1, aStop < bStop);
    float nonEmptyBytes, powerOfTwoBit;
    for (int i = 0; i < BYTE_COUNT; i++) {
        nonEmptyBytes += float(b[i] > 0.0);
        float power = 1.0;
        for (int j = 0; j < 8; j++) {
            powerOfTwoBit = float(b[i] == power) * float(i*8 + j)
                          + float(b[i] != power) * powerOfTwoBit;
            power *= 2.0;
        }
    }
    if (aStop == 0.0 || bStop == 0.0) {
        float carry;
        for (int i = 0; i < BYTE_COUNT; i++) {
            float v = a[i] * b[0] + carry;
            carry = v / 256.0;
            c[i] = mod(v, 256.0);
        }
    } else if (nonEmptyBytes == 1.0 && powerOfTwoBit > 0.0) {
        biguintLshift(a, c, powerOfTwoBit);
    } else {
        float product, carry;
        float t2[BYTE_COUNT*2];
        for (int i = 0; i < BYTE_COUNT; i++) {
            for (int j = 0; j < BYTE_COUNT; j++) {
                product = a[i] * b[j] + t2[i+j];
                carry = product / 256.0;
                t2[i+j] = product - carry * 256.0;
                t2[i+j+1] += carry;
            }
        }
        for (int i = 0; i < BYTE_COUNT; i++) c[i] = t2[i];
    }
}

#endif