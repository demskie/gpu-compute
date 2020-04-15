#ifndef BIG_UINT_MOD_01
#define BIG_UINT_MOD_01

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_DIV_00
void biguintDiv(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_MUL_00
void biguintMul(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_SUB_00
void biguintSub(in float [BYTE_COUNT], in float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_LSHIFT_00
void biguintLshift(in float [BYTE_COUNT], inout float [BYTE_COUNT], float);
#endif

void biguintMod(in float ia[BYTE_COUNT], float f, inout float oc[BYTE_COUNT]) {
    float ib[BYTE_COUNT], tc[BYTE_COUNT];
    ib[0] = mod(f, 256.0);
    ib[1] = floor(f / 256.0);
	biguintDiv(ia, ib, oc);
    biguintMul(oc, ib, tc);
    biguintSub(ia, tc, oc);
}

#endif