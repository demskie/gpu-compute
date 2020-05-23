#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float eq(float, float);
float neq(float, float);

void bigintAssign(inout float [BYTE_COUNT], float);

void bigintAssignIfTrue(inout float dst[BYTE_COUNT], float src[BYTE_COUNT], float f) {
    for (int i = 0; i < BYTE_COUNT; i++)
       dst[i] = src[i] * neq(f, 0.0)
              + dst[i] * eq(f, 0.0);
}

void bigintAssignIfTrue(inout float dst[BYTE_COUNT], float src[BYTE_COUNT], bool b) {
    bigintAssignIfTrue(dst, src, float(b));
}

void bigintAssignIfTrue(inout float dst[BYTE_COUNT], float sf, float f) {
    float src[BYTE_COUNT];
    bigintAssign(dst, sf);
    bigintAssignIfTrue(dst, src, f);
}

void bigintAssignIfTrue(inout float dst[BYTE_COUNT], float sf, bool b) {
    float src[BYTE_COUNT];
    bigintAssign(dst, sf);
    bigintAssignIfTrue(dst, src, float(b));
}