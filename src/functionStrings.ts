export const round = `
float round(float f) {
  return floor(f + 0.5);
}`.trim();

export const floatEquals = `
float floatEquals(float f1, float f2) {
  return 1.0 - abs(sign(f1 - f2));
}`.trim();

export const floatNotEquals = `
float floatNotEquals(float f1, float f2) {
  return abs(sign(f1 - f2));
}`.trim();

export const floatLessThan = `
float floatLessThan(float f1, float f2) {
  return max(sign(f2 - f1), 0.0);
}`.trim();

export const floatGreaterThan = `
float floatGreaterThan(float f1, float f2) {
  return max(sign(f1 - f2), 0.0);
}`.trim();

export const floatLessThanOrEqual = `
float floatLessThanOrEqual(float f1, float f2) {
  return 1.0 - floatGreaterThan(f1, f2);
}`.trim();

export const floatGreaterThanOrEqual = `
float floatGreaterThanOrEqual(float f1, float f2) {
  return 1.0 - floatLessThan(f1, f2);
}`.trim();

export const vec2ToInt16 = `
float vec2ToInt16(vec2 v) {
  return clamp(floor(floor(v.r * 255.0) * 256.0) + floor(v.g * 255.0) - 32767.0, -32767.0, 32768.0);
}`.trim();

export const int16ToVec2 = `
vec2 int16ToVec2(float f) {
  f = clamp(f, -32767.0, 32768.0) + 32767.0; 
  return vec2(floor(f / 256.0), f - floor(f / 256.0) * 256.0) / 255.0; 
}`.trim();

export const vec2ToUint16 = `
float vec2ToUint16(vec2 v) {
  return clamp(floor(floor(v.r * 255.0) * 256.0) + floor(v.g * 255.0), 0.0, 65535.0);
}`.trim();

export const uint16ToVec2 = `
vec2 uint16ToVec2(float f) {
  f = clamp(f, 0.0, 65535.0); 
  return vec2(floor(f / 256.0), f - floor(f / 256.0) * 256.0) / 255.0; 
}`.trim();

export const unpackBooleans = `
void unpackBooleans(float f, inout bool arr[8]) {
  f = floor(f * 255.0);
  arr[0] = bool(int(floatGreaterThanOrEqual(f, 128.0)));
  f -= floatGreaterThanOrEqual(f, 128.0) * 128.0;
  arr[1] = bool(int(floatGreaterThanOrEqual(f, 64.0)));
  f -= floatGreaterThanOrEqual(f, 64.0) * 64.0;
  arr[2] = bool(int(floatGreaterThanOrEqual(f, 32.0)));
  f -= floatGreaterThanOrEqual(f, 32.0) * 32.0;
  arr[3] = bool(int(floatGreaterThanOrEqual(f, 16.0)));
  f -= floatGreaterThanOrEqual(f, 16.0) * 16.0;
  arr[4] = bool(int(floatGreaterThanOrEqual(f, 8.0)));
  f -= floatGreaterThanOrEqual(f, 8.0) * 8.0;
  arr[5] = bool(int(floatGreaterThanOrEqual(f, 4.0)));
  f -= floatGreaterThanOrEqual(f, 4.0) * 4.0;
  arr[6] = bool(int(floatGreaterThanOrEqual(f, 2.0)));
  f -= floatGreaterThanOrEqual(f, 2.0) * 2.0;
  arr[7] = bool(int(floatGreaterThanOrEqual(f, 1.0)));
}`.trim();

export const packBooleans = `
float packBooleans(bool arr[8]) {
  float f = float(int(arr[0])) * 128.0;
  f += float(int(arr[1])) * 64.0;
  f += float(int(arr[2])) * 32.0;
  f += float(int(arr[3])) * 16.0;
  f += float(int(arr[4])) * 8.0;
  f += float(int(arr[5])) * 4.0;
  f += float(int(arr[6])) * 2.0;
  return f + float(int(arr[7]));
}`.trim();

export const addToVec2 = `
vec2 addToVec2(vec2 v, float f, float w) {
  float hOver = floatLessThan(v.x + f, 0);
  v.y += floor((v.x + f) / w) - hOver;
  v.x = mod(v.x + f, w);
  return v;
}`.trim();

export const functionStrings = {
  round,
  floatEquals,
  floatNotEquals,
  floatLessThan,
  floatGreaterThan,
  floatLessThanOrEqual,
  floatGreaterThanOrEqual,
  vec2ToInt16,
  int16ToVec2,
  vec2ToUint16,
  uint16ToVec2,
  unpackBooleans,
  packBooleans,
  addToVec2
};
