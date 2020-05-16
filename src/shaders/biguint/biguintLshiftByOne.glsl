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

void biguintLshiftByOne(inout float a[BYTE_COUNT]) {
    for (int i = BYTE_COUNT - 1; i > 0; i--) 
        a[i] = biguintOrByte(biguintLshiftByte(a[i], 1.0), 
                             biguintRshiftByte(a[i-1], 8.0-1.0));
    a[0] = biguintLshiftByte(a[0], 1.0);
}