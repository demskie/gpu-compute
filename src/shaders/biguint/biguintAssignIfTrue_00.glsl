#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
#define BIG_UINT_ASSIGN_IF_TRUE_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void bignumAssignIfTrue(inout float dst[BYTE_COUNT], in float src[BYTE_COUNT], bool b) {
    for (int i = 0; i < BYTE_COUNT; i++) {
        dst[i] = float(b) * src[i] + float(!b) * dst[i];
    }
}

#endif