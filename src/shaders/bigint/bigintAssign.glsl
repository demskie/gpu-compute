#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void bigintApplyTwosComplement(inout float [BYTE_COUNT], float);

void bigintAssign(inout float dst[BYTE_COUNT], float src[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT; i++) dst[i] = src[i];
}

void bigintAssign(inout float dst[BYTE_COUNT], float f) {
    float isNegative = float(f < 0.0);
    f = min(abs(floor(f)), 65535.0);
    dst[0] = mod(f, 256.0);
    dst[1] = floor(f / 256.0);
    for (int i = 2; i < BYTE_COUNT; i++) dst[i] = 0.0;
    bigintApplyTwosComplement(dst, isNegative);
}