import * as gpu from "../index";

export function execute() {
  const width = 128;
  const source = `
  #ifdef GL_ES
  precision mediump float;
  precision mediump int;
  precision mediump sampler2D;
  #endif
  
  uniform sampler2D u_gpuData;
  const float TEXTURE_WIDTH = ${width}.0;
  
  float vec2ToInt16(vec2 v) { return clamp(floor(floor(v.r * 255.0) * 256.0) + floor(v.g * 255.0) - 32767.0, -32767.0, 32768.0); }
  vec2 int16ToVec2(float f) { f = clamp(f, -32767.0, 32768.0) + 32767.0; return vec2(floor(f / 256.0), f - floor(f / 256.0) * 256.0) / 255.0; }
  
  void main() {
    vec4 texel = texture2D(u_gpuData, gl_FragCoord.xy / TEXTURE_WIDTH);
    float x = mod(vec2ToInt16(texel.rg) + floor(gl_FragCoord.x), TEXTURE_WIDTH);
    float y = mod(vec2ToInt16(texel.ba) + floor(gl_FragCoord.y), TEXTURE_WIDTH);
    gl_FragColor = vec4(int16ToVec2(x), int16ToVec2(y));
  }`;

  // initialize primatives
  const targetAlpha = new gpu.RenderTarget(width);
  const targetBravo = new gpu.RenderTarget(width);
  const shader = new gpu.ComputeShader(source);

  // push some data into texture
  const data = new Uint8Array(4 * width * width).fill(128);
  targetAlpha.pushTextureData(data);

  // mutate target data
  for (let i = 0; i < 2; i++) {
    targetBravo.compute(shader, { u_gpuData: targetAlpha });
    targetAlpha.compute(shader, { u_gpuData: targetBravo });
  }

  // validate output
  const output = targetAlpha.readPixels();
  const expected = new Uint8Array(output.byteLength).fill(128);
  for (let i = 0; i < 4; i++) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < width; y++) {
        let idx = 4 * (y * width + x);
        let lastX = gpu.unpackInt16(expected[idx + 0], expected[idx + 1]);
        let lastY = gpu.unpackInt16(expected[idx + 2], expected[idx + 3]);
        expected[idx + 0] = gpu.packInt16((lastX + x) % width)[0];
        expected[idx + 1] = gpu.packInt16((lastX + x) % width)[1];
        expected[idx + 2] = gpu.packInt16((lastY + y) % width)[0];
        expected[idx + 3] = gpu.packInt16((lastY + y) % width)[1];
      }
    }
  }
  if (output.toString() !== expected.toString()) throw new Error("did not sort properly");
}
