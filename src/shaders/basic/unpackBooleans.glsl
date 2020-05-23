#ifdef GL_ES
precision highp float;
precision highp int;
#endif

void unpackBooleans(float f, inout bool arr[8]) {
    f = floor(f * 255.0);
    arr[0] = f >= 128.0;
    f -= float(arr[0]) * 128.0;
    arr[1] = f >= 64.0;
    f -= float(arr[1]) * 64.0;
    arr[2] = f >= 32.0;
    f -= float(arr[2]) * 32.0;
    arr[3] = f >= 16.0;
    f -= float(arr[3]) * 16.0;
    arr[4] = f >= 8.0;
    f -= float(arr[4]) * 8.0;
    arr[5] = f >= 4.0;
    f -= float(arr[5]) * 4.0;
    arr[6] = f >= 2.0;
    f -= float(arr[6]) * 2.0;
    arr[7] = f >= 1.0;
}