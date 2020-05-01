#ifndef BIG_UINT_POW_00
#define BIG_UINT_POW_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_SUB_00
void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_MUL_00
void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_00
void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);
#endif

void biguintPow(float a[BYTE_COUNT], float b, inout float c[BYTE_COUNT]) {
    b = max(floor(b), 0.0);
    c[0] = 1.0;
    for (int i = 1; i < BYTE_COUNT; i++) c[i] = 0.0;
    biguintAssignIfTrue(c, a, float(b != 0.0));
    for (int i = 0; i < 65536; i++) {
        if (b <= 1.0) break;
        biguintMul(c, a, c);
        b -= 1.0;
    }
}

#endif