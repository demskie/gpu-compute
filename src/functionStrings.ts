import * as bigint from "./bigint";

const round = `
float round(float f) {
  return floor(f + 0.5);
}`.trim();

const vec2ToInt16 = `
float vec2ToInt16(vec2 v) {
  return clamp(floor(floor(v.r * 255.0) * 256.0) + floor(v.g * 255.0) - 32767.0, -32767.0, 32768.0);
}`.trim();

const int16ToVec2 = `
vec2 int16ToVec2(float f) {
  f = clamp(f, -32767.0, 32768.0) + 32767.0; 
  return vec2(floor(f / 256.0), f - floor(f / 256.0) * 256.0) / 255.0; 
}`.trim();

const vec2ToUint16 = `
float vec2ToUint16(vec2 v) {
  return clamp(floor(floor(v.r * 255.0) * 256.0) + floor(v.g * 255.0), 0.0, 65535.0);
}`.trim();

const uint16ToVec2 = `
vec2 uint16ToVec2(float f) {
  f = clamp(f, 0.0, 65535.0); 
  return vec2(floor(f / 256.0), f - floor(f / 256.0) * 256.0) / 255.0; 
}`.trim();

const unpackBooleans = `
void unpackBooleans(float f, inout bool arr[8]) {
  f = floor(f * 255.0);
  arr[0] = bool(int(1.0 - max(sign(128.0 - f), 0.0)));  
  f -= (1.0 - max(sign(128.0 - f), 0.0)) * 128.0;
  arr[1] = bool(int(1.0 - max(sign(64.0 - f), 0.0)));
  f -= (1.0 - max(sign(64.0 - f), 0.0)) * 64.0;
  arr[2] = bool(int(1.0 - max(sign(32.0 - f), 0.0)));
  f -= (1.0 - max(sign(32.0 - f), 0.0)) * 32.0;
  arr[3] = bool(int(1.0 - max(sign(16.0 - f), 0.0)));
  f -= (1.0 - max(sign(16.0 - f), 0.0)) * 16.0;
  arr[4] = bool(int(1.0 - max(sign(8.0 - f), 0.0)));
  f -= (1.0 - max(sign(8.0 - f), 0.0)) * 8.0;
  arr[5] = bool(int(1.0 - max(sign(4.0 - f), 0.0)));
  f -= (1.0 - max(sign(4.0 - f), 0.0)) * 4.0;
  arr[6] = bool(int(1.0 - max(sign(2.0 - f), 0.0)));
  f -= (1.0 - max(sign(2.0 - f), 0.0)) * 2.0;
  arr[7] = bool(int(1.0 - max(sign(1.0 - f), 0.0)));
}`.trim();

const packBooleans = `
float packBooleans(bool arr[8]) {
  float f = float(int(arr[0])) * 128.0;
  f += float(int(arr[1])) * 64.0;
  f += float(int(arr[2])) * 32.0;
  f += float(int(arr[3])) * 16.0;
  f += float(int(arr[4])) * 8.0;
  f += float(int(arr[5])) * 4.0;
  f += float(int(arr[6])) * 2.0;
  return (f + float(int(arr[7]))) / 255.0;
}`.trim();

export const functionStrings = {
  round,
  vec2ToInt16,
  int16ToVec2,
  vec2ToUint16,
  uint16ToVec2,
  unpackBooleans,
  packBooleans
};

export function expandDefinitions(s: string) {
  return bigint.expandDefinitions(s);
}
