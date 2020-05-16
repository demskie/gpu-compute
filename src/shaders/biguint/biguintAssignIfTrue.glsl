#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintAssign(inout float [BYTE_COUNT], float);

void biguintAssignIfTrue(inout float dst[BYTE_COUNT], float src[BYTE_COUNT], float f) {
    for (int i = 0; i < BYTE_COUNT; i++) 
        dst[i] = src[i] * float(f != 0.0)
               + dst[i] * float(f == 0.0);
}

void biguintAssignIfTrue(inout float dst[BYTE_COUNT], float src[BYTE_COUNT], bool b) {
    biguintAssignIfTrue(dst, src, float(b));
}

void biguintAssignIfTrue(inout float dst[BYTE_COUNT], float sf, float f) {
    float src[BYTE_COUNT];
    biguintAssign(dst, sf);
    biguintAssignIfTrue(dst, src, f);
}

void biguintAssignIfTrue(inout float dst[BYTE_COUNT], float sf, bool b) {
    float src[BYTE_COUNT];
    biguintAssign(dst, sf);
    biguintAssignIfTrue(dst, src, float(b));
}