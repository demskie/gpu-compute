#ifndef BIG_UINT_RSHIFT_BY_ONE_00
#define BIG_UINT_RSHIFT_BY_ONE_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_LSHIFT_BYTE_00
float biguintLshiftByte(float, float);
#endif

#ifndef BIG_UINT_RSHIFT_BYTE_00
float biguintRshiftByte(float, float);
#endif

#ifndef BIG_UINT_OR_BYTE_00
float biguintOrByte(float, float);
#endif

void biguintRshiftByOne(inout float a[BYTE_COUNT]) {
    for (int i = 0; i < BYTE_COUNT - 1; i++)
        a[i] = biguintOrByte(biguintRshiftByte(a[i], 1.0),
                             biguintLshiftByte(a[i+1], 8.0-1.0));
    a[BYTE_COUNT-1] = biguintRshiftByte(a[BYTE_COUNT-1], 1.0);
}

#endif