#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float eq(float x, float y) {
    return 1.0 - abs(sign(x - y));
}