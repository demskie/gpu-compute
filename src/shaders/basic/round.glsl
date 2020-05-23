#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float round(float f) {
    return floor(f + 0.5);
}