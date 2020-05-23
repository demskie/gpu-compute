#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float neq(float x, float y) {
    return abs(sign(x - y));
}