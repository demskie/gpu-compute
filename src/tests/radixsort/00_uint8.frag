#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_data;
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
texint getHalf(texint, float);

void main() {
	// get source coordinate using strange logic
	texint sourceCoord = getHalf(texint(int(floor(gl_FragCoord.x)), int(floor(gl_FragCoord.y))), u_textureWidth);
	sourceCoord = getHalf(sourceCoord, u_textureWidth); 

	// get texel data
	vec2 sourceFragCoord = vec2(float(sourceCoord.x) + 0.5, float(sourceCoord.y) + 0.5);
	vec4 sourceTexel = texture2D(u_data, sourceFragCoord.xy / u_textureWidth);

	// output corresponding color channels
	vec4 result = vec4(0.0, 0.0, 0.0, 0.0);
	float offset = mod(floor(gl_FragCoord.x), 4.0);
	result.r += floatEquals(offset, 0.0) * sourceTexel.r;
	result.r += floatEquals(offset, 1.0) * sourceTexel.g;
	result.r += floatEquals(offset, 2.0) * sourceTexel.b;
	result.r += floatEquals(offset, 3.0) * sourceTexel.a;
	gl_FragColor = result;
}