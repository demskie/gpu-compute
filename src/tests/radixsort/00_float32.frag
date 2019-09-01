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
	vec4 texel = texture2D(u_data, vec2(gl_FragCoord.xy) / u_textureWidth);

	// denormalize texel data
	texel *= 255.0;
	
	// flip only sign bit if sign bit was not already set
	// otherwise flip all of the bits
	if (floatLessThan(texel.a, 128.0) == 1.0) {
		texel.a += 128.0;
	} else {
		texel.a = 255.0 - texel.a;
		texel.b = 255.0 - texel.b;
		texel.g = 255.0 - texel.g;
		texel.r = 255.0 - texel.r;
	}

	// output denormalized texel
	gl_FragColor = texel / 255.0;
}