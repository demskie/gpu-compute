#ifdef GL_ES
precision highp float;
precision highp int;
#endif

vec2 int16ToVec2(float f) {
    f = clamp(f, -32767.0, 32768.0) + 32767.0; 
    return vec2(floor(f / 256.0), f - floor(f / 256.0) * 256.0) / 255.0; 
}