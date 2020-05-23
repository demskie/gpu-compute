#ifdef GL_ES
precision highp float;
precision highp int;
#endif

float packBooleans(bool arr[8]) {
    return (
        float(arr[0]) * 128.0
      + float(arr[1]) * 64.0
      + float(arr[2]) * 32.0
      + float(arr[3]) * 16.0
      + float(arr[4]) * 8.0
      + float(arr[5]) * 4.0
      + float(arr[6]) * 2.0
      + float(arr[7])
    ) / 255.0;
}