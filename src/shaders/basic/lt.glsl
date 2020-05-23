#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float lt(float x, float y) {
    return max(sign(y - x), 0.0);
}