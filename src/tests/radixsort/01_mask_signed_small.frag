#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_indices;
uniform sampler2D u_data;
uniform float u_bitIndex;
uniform float u_byteCount;
uniform float u_textureWidth;

float round(float);
float floatEquals(float, float);
float floatLessThan(float, float);
float floatGreaterThan(float, float);
float floatLessThanOrEqual(float, float);
float floatGreaterThanOrEqual(float, float);
float vec2ToUint16(vec2);
vec2 uint16ToVec2(float);

bool getMSB(float);
float clearMSB(float);
float setMSB(float, bool);

struct texint { int x; int y; };
texint add(texint, texint, float);
texint subtract(texint, texint, float);
texint zeroize(texint, bool);
texint getHalf(texint, float);
texint getQuarter(texint, float);
texint getDouble(texint, float);
texint getQuadruple(texint, float);
texint getOctuple(texint, float);
texint getSexdecuple(texint, float);
texint toTexint(vec2);
vec2 toVec2(texint);

void main() {
	// get index coordinates for data
	vec4 indexTexel = texture2D(u_indices, gl_FragCoord.xy / u_textureWidth);
	texint indexCoord = texint(int(vec2ToUint16(indexTexel.rg)), int(vec2ToUint16(indexTexel.ba)));
	indexCoord = toTexint(floatGreaterThan(u_byteCount, 0.00) * floatLessThanOrEqual(u_byteCount, 1.00) * toVec2(getQuarter(indexCoord, u_textureWidth))
			   			+ floatGreaterThan(u_byteCount, 1.00) * floatLessThanOrEqual(u_byteCount, 2.00) * toVec2(getHalf(indexCoord, u_textureWidth))
			   			+ floatGreaterThan(u_byteCount, 2.00) * floatLessThanOrEqual(u_byteCount, 4.00) * toVec2(indexCoord)
			   			+ floatGreaterThan(u_byteCount, 4.00) * floatLessThanOrEqual(u_byteCount, 8.00) * toVec2(getDouble(indexCoord, u_textureWidth))
			   			+ floatGreaterThan(u_byteCount, 8.00) * floatLessThanOrEqual(u_byteCount, 16.0) * toVec2(getQuadruple(indexCoord, u_textureWidth))
						+ floatGreaterThan(u_byteCount, 16.0) * floatLessThanOrEqual(u_byteCount, 32.0) * toVec2(getOctuple(indexCoord, u_textureWidth))
						+ floatGreaterThan(u_byteCount, 32.0) * floatLessThanOrEqual(u_byteCount, 64.0) * toVec2(getSexdecuple(indexCoord, u_textureWidth)));

	// get the texel containing the MSB (and sign bit)
	int distFromMostSig = int((u_byteCount - floor(u_bitIndex / 8.0)) / 4.0);
	texint mostSigCoord = add(indexCoord, texint(distFromMostSig, 0), u_textureWidth);
	vec4 mostSigTexel = texture2D(u_data, vec2(float(mostSigCoord.x) + 0.5, mod(float(mostSigCoord.y), u_textureWidth) + 0.5) / u_textureWidth);

	// get the texel containing the target bit to be masked
	int distFromTarget = int(floor(u_bitIndex / 32.0));
	texint targetCoord = add(indexCoord, texint(distFromTarget, 0), u_textureWidth);
	vec4 texel = texture2D(u_data, vec2(float(targetCoord.x) + 0.5, mod(float(targetCoord.y), u_textureWidth) + 0.5) / u_textureWidth);

	// reorganize data for multi-packed texels
	texel.r = floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * 0.0
			+ floatGreaterThan(u_byteCount, 1.0) * floatLessThanOrEqual(u_byteCount, 2.0) * 0.0
			+ floatGreaterThan(u_byteCount, 2.0) * floatLessThanOrEqual(u_byteCount, 16.0) * texel.r;
	texel.g = floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * 0.0
			+ floatGreaterThan(u_byteCount, 1.0) * floatLessThanOrEqual(u_byteCount, 2.0) * 0.0
			+ floatGreaterThan(u_byteCount, 2.0) * floatLessThanOrEqual(u_byteCount, 64.0) * texel.g;
	texel.b = floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * 0.0
			+ floatGreaterThan(u_byteCount, 1.0) * floatLessThanOrEqual(u_byteCount, 2.0) * floatEquals(mod(floor(gl_FragCoord.x), 2.0), 0.0) * texel.r
			+ floatGreaterThan(u_byteCount, 1.0) * floatLessThanOrEqual(u_byteCount, 2.0) * floatEquals(mod(floor(gl_FragCoord.x), 2.0), 1.0) * texel.b
			+ floatGreaterThan(u_byteCount, 2.0) * floatLessThanOrEqual(u_byteCount, 64.0) * texel.b;
	texel.a = floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 0.0) * texel.r
			+ floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 1.0) * texel.g
			+ floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 2.0) * texel.b
			+ floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 3.0) * texel.a
			+ floatGreaterThan(u_byteCount, 1.0) * floatLessThanOrEqual(u_byteCount, 2.0) * floatEquals(mod(floor(gl_FragCoord.x), 2.0), 0.0) * texel.g
			+ floatGreaterThan(u_byteCount, 1.0) * floatLessThanOrEqual(u_byteCount, 2.0) * floatEquals(mod(floor(gl_FragCoord.x), 2.0), 1.0) * texel.a
			+ floatGreaterThan(u_byteCount, 2.0) * floatLessThanOrEqual(u_byteCount, 64.0) * texel.a;

	// determine if sign bit is already set
	float signBitIsSet = floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 0.0) * floatGreaterThanOrEqual(mostSigTexel.r * 255.0, 128.0)
					   + floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 1.0) * floatGreaterThanOrEqual(mostSigTexel.g * 255.0, 128.0)
					   + floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 2.0) * floatGreaterThanOrEqual(mostSigTexel.b * 255.0, 128.0)
					   + floatGreaterThan(u_byteCount, 0.0) * floatLessThanOrEqual(u_byteCount, 1.0) * floatEquals(mod(floor(gl_FragCoord.x), 4.0), 3.0) * floatGreaterThanOrEqual(mostSigTexel.a * 255.0, 128.0)
					   + floatGreaterThan(u_byteCount, 1.0) * floatLessThanOrEqual(u_byteCount, 2.0) * floatEquals(mod(floor(gl_FragCoord.x), 2.0), 0.0) * floatGreaterThanOrEqual(mostSigTexel.g * 255.0, 128.0)
					   + floatGreaterThan(u_byteCount, 1.0) * floatLessThanOrEqual(u_byteCount, 2.0) * floatEquals(mod(floor(gl_FragCoord.x), 2.0), 1.0) * floatGreaterThanOrEqual(mostSigTexel.a * 255.0, 128.0)
					   + floatGreaterThan(u_byteCount, 2.0) * floatLessThanOrEqual(u_byteCount, 64.0) * floatGreaterThanOrEqual(mostSigTexel.a * 255.0, 128.0);

	// denormalize texel data
	texel *= 255.0;

	// flip only sign bit if sign bit was not already set
	// otherwise flip all of the bits
	texel.r = floatEquals(signBitIsSet, 0.0) * texel.r
			+ floatEquals(signBitIsSet, 1.0) * (255.0 - texel.r);
	texel.g = floatEquals(signBitIsSet, 0.0) * texel.g
			+ floatEquals(signBitIsSet, 1.0) * (255.0 - texel.g);
	texel.b = floatEquals(signBitIsSet, 0.0) * texel.b
			+ floatEquals(signBitIsSet, 1.0) * (255.0 - texel.b);
	texel.a = floatEquals(signBitIsSet, 0.0) * (texel.a + 128.0)
			+ floatEquals(signBitIsSet, 1.0) * (255.0 - texel.a);

	// get the byte value that contains the bit flag in question
	float bitIndex = mod(u_bitIndex, 32.0);
	float byte = floatGreaterThanOrEqual(bitIndex, 0.0) * floatLessThan(bitIndex, 8.0) * texel.r
               + floatGreaterThanOrEqual(bitIndex, 8.0) * floatLessThan(bitIndex, 16.0) * texel.g
               + floatGreaterThanOrEqual(bitIndex, 16.0) * floatLessThan(bitIndex, 24.0) * texel.b
               + floatGreaterThanOrEqual(bitIndex, 24.0) * floatLessThan(bitIndex, 32.0) * texel.a;

	// pull bit flag from byte value
	float flag = 0.0;
	bitIndex = mod(bitIndex, 8.0);
	flag += floatEquals(bitIndex, 0.0) * floatGreaterThanOrEqual(byte, 128.0);
	byte -= floatGreaterThanOrEqual(byte, 128.0) * 128.0;
	flag += floatEquals(bitIndex, 1.0) * floatGreaterThanOrEqual(byte, 64.0);
	byte -= floatGreaterThanOrEqual(byte, 64.0) * 64.0;
	flag += floatEquals(bitIndex, 2.0) * floatGreaterThanOrEqual(byte, 32.0);
	byte -= floatGreaterThanOrEqual(byte, 32.0) * 32.0;
	flag += floatEquals(bitIndex, 3.0) * floatGreaterThanOrEqual(byte, 16.0);
	byte -= floatGreaterThanOrEqual(byte, 16.0) * 16.0;
	flag += floatEquals(bitIndex, 4.0) * floatGreaterThanOrEqual(byte, 8.0);
	byte -= floatGreaterThanOrEqual(byte, 8.0) * 8.0;
	flag += floatEquals(bitIndex, 5.0) * floatGreaterThanOrEqual(byte, 4.0);
	byte -= floatGreaterThanOrEqual(byte, 4.0) * 4.0;
	flag += floatEquals(bitIndex, 6.0) * floatGreaterThanOrEqual(byte, 2.0);
	byte -= floatGreaterThanOrEqual(byte, 2.0) * 2.0;
	flag += floatEquals(bitIndex, 7.0) * floatGreaterThanOrEqual(byte, 1.0);

	// flip boolean value
	flag = floatEquals(flag, 0.0);

	// push bit flag into most significant bit of red color channel
	gl_FragColor = vec4(setMSB(0.0, bool(flag)), flag/255.0, 0.0, 0.0);
}