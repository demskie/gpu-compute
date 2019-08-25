import * as gpu from "../index";

test("basicComputeShader", () => {
  const textureWidth = 128;
  const source = `
  precision mediump float;
  precision mediump int;
  precision mediump sampler2D;
  
  uniform sampler2D u_gpuData;
  const float TEXTURE_WIDTH = ${textureWidth}.0;
  
  float vec2ToInt16(vec2 v) { return clamp(floor(floor(v.r * 255.0) * 256.0) + floor(v.g * 255.0) - 32767.0, -32767.0, 32768.0); }
  vec2 int16ToVec2(float f) { f = clamp(f, -32767.0, 32768.0) + 32767.0; return vec2(floor(f / 256.0), f - floor(f / 256.0) * 256.0) / 255.0; }
  
  void main() {
    vec4 texel = texture2D(u_gpuData, gl_FragCoord.xy / TEXTURE_WIDTH);
    float x = mod(vec2ToInt16(texel.rg) + floor(gl_FragCoord.x), TEXTURE_WIDTH);
    float y = mod(vec2ToInt16(texel.ba) + floor(gl_FragCoord.y), TEXTURE_WIDTH);
    gl_FragColor = vec4(int16ToVec2(x), int16ToVec2(y));
  }`;
  // initialize primatives
  const target = new gpu.RenderTarget(textureWidth);
  const shader = new gpu.ComputeShader(source);

  // push data into texture
  target.pushTextureData(new Uint8Array(textureWidth * textureWidth * 4).fill(128));

  // loop program using previous output as input
  for (var i = 0; i < 4; i++) {
    target.compute(shader, { u_gpuData: target });
  }
  const output = target.readPixels();

  // sanity check results
  const expected = new Uint8Array(textureWidth * textureWidth * 4).fill(128);
  for (var i = 0; i < 4; i++) {
    var idx = 0;
    for (var y = 0; y < textureWidth; y++) {
      for (var x = 0; x < textureWidth; x++) {
        var xVal = gpu.unpackInt16(expected[idx + 0], expected[idx + 1]);
        var yVal = gpu.unpackInt16(expected[idx + 2], expected[idx + 3]);
        expected[idx++] = gpu.packInt16((xVal + x) % textureWidth)[0];
        expected[idx++] = gpu.packInt16((xVal + x) % textureWidth)[1];
        expected[idx++] = gpu.packInt16((yVal + y) % textureWidth)[0];
        expected[idx++] = gpu.packInt16((yVal + y) % textureWidth)[1];
      }
    }
  }
  if (output.toString() !== expected.toString()) throw new Error(`difference detected`);
});
