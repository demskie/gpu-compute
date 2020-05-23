#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float uint16FromVec2(vec2 v) {
    return clamp(floor(floor(v.r * 255.0) * 256.0) + floor(v.g * 255.0), 0.0, 65535.0);
}