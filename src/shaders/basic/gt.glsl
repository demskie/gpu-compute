#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float gt(float x, float y) {
    return max(sign(x - y), 0.0);
}