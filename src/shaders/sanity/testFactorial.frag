#ifdef GL_ES
precision highp float;
precision highp int;
precision highp sampler2D;
#endif

#define BYTE_COUNT 16

void biguintMul(float [BYTE_COUNT], float, inout float [BYTE_COUNT]);
void biguintAssign(inout float [BYTE_COUNT], float);

// 34! == 295232799039604140847618609643520000000

void main() {
    float c[BYTE_COUNT];

    biguintAssign(c, 1.0);
    for (int n = 1; n <= 34; n++) {
        biguintMul(c, float(n), c);
    }

    vec4 ovec;
    ovec += float(gl_FragCoord.x == 0.5 && gl_FragCoord.y == 0.5) * vec4(c[0], c[1], c[2], c[3]);
    ovec += float(gl_FragCoord.x == 1.5 && gl_FragCoord.y == 0.5) * vec4(c[4], c[5], c[6], c[7]);
    ovec += float(gl_FragCoord.x == 0.5 && gl_FragCoord.y == 1.5) * vec4(c[8], c[9], c[10], c[11]);
    ovec += float(gl_FragCoord.x == 1.5 && gl_FragCoord.y == 1.5) * vec4(c[12], c[13], c[14], c[15]);
    gl_FragColor = ovec / 255.0;
}