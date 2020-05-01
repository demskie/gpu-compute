#ifndef BIG_UINT_RSHIFT_00
#define BIG_UINT_RSHIFT_00

#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

#ifndef BIG_UINT_LSHIFT_WORD_00
void biguintLshiftWord(inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_LSHIFT_BYTE_00
float biguintLshiftByte(float, float);
#endif

#ifndef BIG_UINT_RSHIFT_WORD_00
void biguintRshiftWord(inout float [BYTE_COUNT], float);
#endif

#ifndef BIG_UINT_RSHIFT_BYTE_00
float biguintRshiftByte(float, float);
#endif

#ifndef BIG_UINT_OR_BYTE_00
float biguintOrByte(float, float);
#endif

#ifndef BIG_UINT_ASSIGN_00
void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);
#endif

#ifndef BIG_UINT_ASSIGN_IF_TRUE_00
void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);
#endif

void biguintRshift(float a[BYTE_COUNT], inout float b[BYTE_COUNT], float count) {
    count = clamp(floor(count), 0.0, float(BYTE_COUNT*8));
    biguintAssign(b, a);
    biguintRshiftWord(b, floor(count / 8.0));
    float bits = mod(count, 8.0);
    float t1[BYTE_COUNT];
    biguintAssign(t1, b);
    for (int i = 0; i < BYTE_COUNT - 1; i++)
        t1[i] = biguintOrByte(biguintRshiftByte(t1[i], bits),
                              biguintLshiftByte(t1[i+1], 8.0-bits));
    t1[BYTE_COUNT-1] = biguintRshiftByte(t1[BYTE_COUNT-1], bits);
    biguintAssignIfTrue(b, t1, float(bits != 0.0));
}

#endif