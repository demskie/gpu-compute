#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_data;
uniform float u_factor;
uniform float u_textureWidth;

float round(float);
float floatEquals(float, float);
float floatLessThan(float, float);
float floatGreaterThan(float, float);
float floatLessThanOrEqual(float, float);
float floatGreaterThanOrEqual(float, float);
float vec2ToUint16(vec2);
vec2 uint16ToVec2(float);

struct texint { int x; int y; };
texint add(texint, texint, float);
texint subtract(texint, texint, float);
texint zeroize(texint, bool);

void main() {
  float divideByTwoBool = floatGreaterThanOrEqual(u_factor, 2.0);
  float divideByFourBool = floatGreaterThanOrEqual(u_factor, 4.0);
  
  texint sourceCoord = texint(int(floor(gl_FragCoord.x)), int(floor(gl_FragCoord.y)));
  sourceCoord = subtract(sourceCoord, texint((sourceCoord.x / 2) * int(divideByTwoBool), 
                                             (sourceCoord.y / 2) * int(divideByTwoBool)), u_textureWidth);
  sourceCoord = subtract(sourceCoord, texint((sourceCoord.x / 2) * int(divideByFourBool), 
                                             (sourceCoord.y / 2) * int(divideByFourBool)), u_textureWidth);

  sourceCoord.x = int(clamp(float(sourceCoord.x), 0.0, u_textureWidth));
  sourceCoord.y = int(clamp(float(sourceCoord.y), 0.0, u_textureWidth));

  vec2 sourceFragCoord = vec2(float(sourceCoord.x) + 0.5, float(sourceCoord.y) + 0.5);
  vec4 sourceTexel = texture2D(u_data, sourceFragCoord.xy / u_textureWidth);

  float isValidFactor = max(floatEquals(u_factor, 2.0), floatEquals(u_factor, 4.0));
  vec4 result = vec4(sourceTexel.rgba) * floatEquals(isValidFactor, 0.0);

  float doubleOffset = mod(float(sourceCoord.x), 2.0);
  result.b += floatEquals(u_factor, 2.0) * floatEquals(doubleOffset, 0.0) * sourceTexel.r;
  result.a += floatEquals(u_factor, 2.0) * floatEquals(doubleOffset, 0.0) * sourceTexel.g;
  result.b += floatEquals(u_factor, 2.0) * floatEquals(doubleOffset, 1.0) * sourceTexel.b;
  result.a += floatEquals(u_factor, 2.0) * floatEquals(doubleOffset, 1.0) * sourceTexel.a;
  
  float quadOffset = mod(float(sourceCoord.x), 4.0);
  result.a += floatEquals(u_factor, 4.0) * floatEquals(quadOffset, 0.0) * sourceTexel.r;
  result.a += floatEquals(u_factor, 4.0) * floatEquals(quadOffset, 1.0) * sourceTexel.g;
  result.a += floatEquals(u_factor, 4.0) * floatEquals(quadOffset, 2.0) * sourceTexel.b;
  result.a += floatEquals(u_factor, 4.0) * floatEquals(quadOffset, 3.0) * sourceTexel.a;
  
  gl_FragColor = result;
}