#ifndef BIG_UINT_MOD_00
#define BIG_UINT_MOD_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_DIV_00
void biguintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_MUL_00
void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_SUB_00
void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_LSHIFT_00
void biguintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);
#endif

void biguintMod(float ia[BYTE_COUNT], float ib[BYTE_COUNT], inout float oc[BYTE_COUNT]) {
	float tc[BYTE_COUNT];
	biguintDiv(ia, ib, oc);
    biguintMul(oc, ib, tc);
    biguintSub(ia, tc, oc);
}

#endif