#ifndef BIG_UINT_LSHIFT_WORD
#define BIG_UINT_LSHIFT_WORD

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void biguintLshiftWord(inout float a[BYTE_COUNT], float count) {
    for (int i = BYTE_COUNT - 1; i >= 0; i--)
        a[i] = a[int(max(float(i)-count, 0.0))] 
             * float(float(i)-count >= 0.0);
}
#endif