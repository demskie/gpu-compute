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
	// get texel data
	vec2 sourceFragCoord = vec2(gl_FragCoord.x + 0.5, gl_FragCoord.y + 0.5);
	vec4 texel = texture2D(u_data, sourceFragCoord / u_textureWidth);

	// denormalize texel data
	texel.a = round(texel.a * 255.0);
	texel.b = round(texel.b * 255.0);
	texel.g = round(texel.g * 255.0);
	texel.r = round(texel.r * 255.0);
	
	// determine if sign bit is already set
	float signBitIsSet = floatGreaterThanOrEqual(texel.a, 128.0);

	// flip only sign bit if sign bit was not already set
	texel.a += floatEquals(signBitIsSet, 0.0) * 128.0;

	// otherwise flip all bits
	texel.a = (floatEquals(signBitIsSet, 0.0) * texel.a)
			+ (floatEquals(signBitIsSet, 1.0) * (255.0 - texel.a));
	texel.b = (floatEquals(signBitIsSet, 0.0) * texel.b)
			+ (floatEquals(signBitIsSet, 1.0) * (255.0 - texel.b));
	texel.g = (floatEquals(signBitIsSet, 0.0) * texel.g)
			+ (floatEquals(signBitIsSet, 1.0) * (255.0 - texel.g));
	texel.r = (floatEquals(signBitIsSet, 0.0) * texel.r)
			+ (floatEquals(signBitIsSet, 1.0) * (255.0 - texel.r));

	// output normalized texel
	gl_FragColor = texel / 255.0;
}