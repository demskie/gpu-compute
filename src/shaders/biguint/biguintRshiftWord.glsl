#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float lt(float, float);

void biguintRshiftWord(inout float a[BYTE_COUNT], float count) {
    for (int i = 0; i < BYTE_COUNT; i++) 
        a[i] = a[int(min(float(i)+count, float(BYTE_COUNT) - 1.0))]
             * lt(float(i)+count, float(BYTE_COUNT));
}