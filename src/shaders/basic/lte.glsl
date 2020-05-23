#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float gt(float, float);

float lte(float x, float y) {
    return 1.0 - gt(x, y);
}