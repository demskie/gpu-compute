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
  return 1.0 - max(sign(f1 - f2), 0.0);
}`.trim();

export const floatGreaterThanOrEqual = `
float floatGreaterThanOrEqual(float f1, float f2) {
  return 1.0 - max(sign(f2 - f1), 0.0); 
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

export const packBooleans = `
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

export const texcoord = `
struct texcoord { float x, y, w; };
`.trim();

export const addTexcoord = `
texcoord addTexcoord(texcoord t, float f) {
  t.y = t.y + floor(f / t.w) + floor((t.x + mod(f, t.w)) / t.w);
  t.x = mod(t.x + f, t.w);
  return t;
}`.trim();

export const subtractTexcoord = `
texcoord subtractTexcoord(texcoord t, float f) {
  t.y = t.y - floor(f / t.w) + floor((t.x - mod(f, t.w)) / t.w);
  t.x = mod(t.x - f, t.w);
  return t;
}`.trim();

export const oneSixteenthTexcoord = `
texcoord oneSixteenthTexcoord(texcoord t) {
  t.x = floor(t.x / 2.0) + floor(t.w / 2.0) * mod(t.y, 2.0);
  t.y = floor(t.y / 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  t.x = floor(t.x / 2.0) + floor(t.w / 2.0) * mod(t.y, 2.0);
  t.y = floor(t.y / 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  t.x = floor(t.x / 2.0) + floor(t.w / 2.0) * mod(t.y, 2.0);
  t.y = floor(t.y / 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  return t;
}`.trim();

export const oneFourthTexcoord = `
texcoord oneFourthTexcoord(texcoord t) {
  t.x = floor(t.x / 2.0) + floor(t.w / 2.0) * mod(t.y, 2.0);
  t.y = floor(t.y / 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  t.x = floor(t.x / 2.0) + floor(t.w / 2.0) * mod(t.y, 2.0);
  t.y = floor(t.y / 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  return t;
}`.trim();

export const oneHalfTexcoord = `
texcoord oneHalfTexcoord(texcoord t) {
  t.x = floor(t.x / 2.0) + floor(t.w / 2.0) * mod(t.y, 2.0);
  t.y = floor(t.y / 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  return t;
}`.trim();

export const doubleTexcoord = `
texcoord doubleTexcoord(texcoord t) {
  t.x = floor(t.x * 2.0);
  t.y = floor(t.y * 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  return t;
}`.trim();

export const quadrupleTexcoord = `
texcoord quadrupleTexcoord(texcoord t) {
  t.x = floor(t.x * 2.0);
  t.y = floor(t.y * 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  t.x = floor(t.x * 2.0);
  t.y = floor(t.y * 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  return t;
}`.trim();

export const sexdecupleTexcoord = `
texcoord sexdecupleTexcoord(texcoord t) {
  t.x = floor(t.x * 2.0);
  t.y = floor(t.y * 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  t.x = floor(t.x * 2.0);
  t.y = floor(t.y * 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  t.x = floor(t.x * 2.0);
  t.y = floor(t.y * 2.0) + floor(t.x / t.w);
  t.x = mod(t.x, t.w);
  return t;
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
  texcoord,
  addTexcoord,
  subtractTexcoord,
  oneSixteenthTexcoord,
  oneFourthTexcoord,
  oneHalfTexcoord,
  doubleTexcoord,
  quadrupleTexcoord,
  sexdecupleTexcoord
};
