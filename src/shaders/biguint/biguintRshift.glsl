#ifndef BYTE_COUNT
#define BYTE_COUNT 16
#endif

#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float neq(float, float);

void biguintLshiftWord(inout float [BYTE_COUNT], float);
float biguintLshiftByte(float, float);
void biguintRshiftWord(inout float [BYTE_COUNT], float);
float biguintRshiftByte(float, float);
float biguintOrByte(float, float);
void biguintAssign(inout float [BYTE_COUNT], float [BYTE_COUNT]);
void biguintAssignIfTrue(inout float [BYTE_COUNT], float [BYTE_COUNT], float);

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
    biguintAssignIfTrue(b, t1, neq(bits, 0.0));
}