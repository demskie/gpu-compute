#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float biguintLshiftByte(float, float);
float biguintRshiftByte(float, float);
float biguintOrByte(float, float);

void biguintRshiftByOne(inout float a[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT - 1; i++)
        a[i] = biguintOrByte(biguintRshiftByte(a[i], 1.0),
                             biguintLshiftByte(a[i+1], 8.0-1.0));
    a[BYTE_COUNT-1] = biguintRshiftByte(a[BYTE_COUNT-1], 1.0);
}