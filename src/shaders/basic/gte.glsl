#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float lt(float, float);

float gte(float x, float y) {
    return 1.0 - lt(x, y);
}