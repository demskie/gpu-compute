#ifndef BIG_UINT_MOD
#define BIG_UINT_MOD

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_DIV
void biguintDiv(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_MUL
void biguintMul(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_SUB
void biguintSub(float [BYTE_COUNT], float [BYTE_COUNT], inout float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_LSHIFT
void biguintLshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_ASSIGN
void biguintAssign(inout float [BYTE_COUNT], float);
#endif

void biguintMod(float ia[BYTE_COUNT], float ib[BYTE_COUNT], inout float oc[BYTE_COUNT]) {
	float tc[BYTE_COUNT];
	biguintDiv(ia, ib, oc);
    biguintMul(oc, ib, tc);
    biguintSub(ia, tc, oc);
}

void biguintMod(float ia[BYTE_COUNT], float ibf, inout float oc[BYTE_COUNT]) {
    float ib[BYTE_COUNT], tc[BYTE_COUNT];
    biguintAssign(ib, ibf);
    biguintDiv(ia, ib, oc);
    biguintMul(oc, ib, tc);
    biguintSub(ia, tc, oc);
}

#endif