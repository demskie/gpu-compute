#ifdef GL_ES
precision highp float;
precision highp int;
precision highp sampler2D;
#endif

uniform sampler2D u_tex1;
uniform sampler2D u_tex2;

#define BYTE_COUNT 16

void bigintRshift(float [BYTE_COUNT], inout float [BYTE_COUNT], float);

void main() {
    vec4 avec[4];
    avec[0] = texture2D(u_tex1, vec2(0.5, 0.5) / 2.0);
    avec[1] = texture2D(u_tex1, vec2(1.5, 0.5) / 2.0);
    avec[2] = texture2D(u_tex1, vec2(0.5, 1.5) / 2.0);
    avec[3] = texture2D(u_tex1, vec2(1.5, 1.5) / 2.0);

    vec4 bvec[4];
    bvec[0] = texture2D(u_tex2, vec2(0.5, 0.5) / 2.0);
    bvec[1] = texture2D(u_tex2, vec2(1.5, 0.5) / 2.0);
    bvec[2] = texture2D(u_tex2, vec2(0.5, 1.5) / 2.0);
    bvec[3] = texture2D(u_tex2, vec2(1.5, 1.5) / 2.0);

    float a[BYTE_COUNT], b[BYTE_COUNT], c[BYTE_COUNT];
    for (int i = 0; i < 4; i++) {
        a[i*4+0] = avec[i].r * 255.0;
        a[i*4+1] = avec[i].g * 255.0;
        a[i*4+2] = avec[i].b * 255.0;
        a[i*4+3] = avec[i].a * 255.0;
        b[i*4+0] = bvec[i].r * 255.0;
        b[i*4+1] = bvec[i].g * 255.0;
        b[i*4+2] = bvec[i].b * 255.0;
        b[i*4+3] = bvec[i].a * 255.0;
    }

    float bf = b[0] + b[1] * 256.0;
    bigintRshift(a, c, bf);

    vec4 ovec;
    ovec += float(gl_FragCoord.x == 0.5 && gl_FragCoord.y == 0.5) * vec4(c[0], c[1], c[2], c[3]);
    ovec += float(gl_FragCoord.x == 1.5 && gl_FragCoord.y == 0.5) * vec4(c[4], c[5], c[6], c[7]);
    ovec += float(gl_FragCoord.x == 0.5 && gl_FragCoord.y == 1.5) * vec4(c[8], c[9], c[10], c[11]);
    ovec += float(gl_FragCoord.x == 1.5 && gl_FragCoord.y == 1.5) * vec4(c[12], c[13], c[14], c[15]);
    gl_FragColor = ovec / 255.0;
}