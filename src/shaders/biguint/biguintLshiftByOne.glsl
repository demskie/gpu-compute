#ifndef BIG_UINT_LSHIFT_BY_ONE
#define BIG_UINT_LSHIFT_BY_ONE

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_LSHIFT_BYTE
float biguintLshiftByte(float, float);
#endif

#ifndef BIG_UINT_RSHIFT_BYTE
float biguintRshiftByte(float, float);
#endif

#ifndef BIG_UINT_OR_BYTE
float biguintOrByte(float, float);
#endif

void biguintLshiftByOne(inout float a[BYTE_COUNT]) {
    for (int i = BYTE_COUNT - 1; i > 0; i--) 
        a[i] = biguintOrByte(biguintLshiftByte(a[i], 1.0), 
                             biguintRshiftByte(a[i-1], 8.0-1.0));
    a[0] = biguintLshiftByte(a[0], 1.0);
}

#endif