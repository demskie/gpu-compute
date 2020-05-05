#ifndef BIG_UINT_LSHIFT
#define BIG_UINT_LSHIFT

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_LSHIFT_WORD
void biguintLshiftWord(inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_LSHIFT_BYTE
float biguintLshiftByte(float, float);
#endif

#ifndef BIG_UINT_RSHIFT_WORD
void biguintRshiftWord(inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_RSHIFT_BYTE
float biguintRshiftByte(float, float);
#endif

#ifndef BIG_UINT_OR_BYTE
float biguintOrByte(float, float);
#endif

#ifndef BIG_UINT_ASSIGN
void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_IF_TRUE
void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);
#endif

void biguintLshift(float a[BYTE_COUNT], inout float b[BYTE_COUNT], float count) {
    count = clamp(floor(count), 0.0, float(BYTE_COUNT*8));
    biguintAssign(b, a);
    biguintLshiftWord(b, floor(count / 8.0));
    float bits = mod(count, 8.0);
    float t1[BYTE_COUNT];
    biguintAssign(t1, b);
    for (int i = BYTE_COUNT - 1; i > 0; i--) 
        t1[i] = biguintOrByte(biguintLshiftByte(t1[i], bits), 
                              biguintRshiftByte(t1[i-1], 8.0-bits));
    t1[0] = biguintLshiftByte(t1[0], bits);
    biguintAssignIfTrue(b, t1, float(bits != 0.0));
}

#endif