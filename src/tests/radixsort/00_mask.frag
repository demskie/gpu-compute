#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_indices;
uniform sampler2D u_data;
uniform float u_bitIndex;

const float TEXTURE_WIDTH = 1.0;

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
texint add(texint, texint);
texint subtract(texint, texint);
texint zeroize(texint, bool);

void main() {
	// get index coordinates for data
	vec4 indexTexel = texture2D(u_indices, gl_FragCoord.xy / TEXTURE_WIDTH);
	vec2 indexCoord = vec2(vec2ToUint16(indexTexel.rg), vec2ToUint16(indexTexel.ba));

	// get the byte value that contains the bit flag in question
	vec4 texel = texture2D(u_data, vec2(indexCoord.x + 0.5, indexCoord.y + 0.5) / TEXTURE_WIDTH);
	float byte = floatGreaterThanOrEqual(u_bitIndex, 0.0) * floatLessThan(u_bitIndex, 8.0) * texel.r
               + floatGreaterThanOrEqual(u_bitIndex, 8.0) * floatLessThan(u_bitIndex, 16.0) * texel.g
               + floatGreaterThanOrEqual(u_bitIndex, 16.0) * floatLessThan(u_bitIndex, 24.0) * texel.b
               + floatGreaterThanOrEqual(u_bitIndex, 24.0) * floatLessThan(u_bitIndex, 32.0) * texel.a;

	// pull bit flag from byte value
	float bitFlag = 0.0;
	float byteVal = byte * 255.0;
	float bitIndex = mod(u_bitIndex, 8.0);
	bitFlag += floatEquals(bitIndex, 0.0) * floatGreaterThanOrEqual(byteVal, 128.0);
	byteVal -= floatGreaterThanOrEqual(byteVal, 128.0) * 128.0;
	bitFlag += floatEquals(bitIndex, 1.0) * floatGreaterThanOrEqual(byteVal, 64.0);
	byteVal -= floatGreaterThanOrEqual(byteVal, 64.0) * 64.0;
	bitFlag += floatEquals(bitIndex, 2.0) * floatGreaterThanOrEqual(byteVal, 32.0);
	byteVal -= floatGreaterThanOrEqual(byteVal, 32.0) * 32.0;
	bitFlag += floatEquals(bitIndex, 3.0) * floatGreaterThanOrEqual(byteVal, 16.0);
	byteVal -= floatGreaterThanOrEqual(byteVal, 16.0) * 16.0;
	bitFlag += floatEquals(bitIndex, 4.0) * floatGreaterThanOrEqual(byteVal, 8.0);
	byteVal -= floatGreaterThanOrEqual(byteVal, 8.0) * 8.0;
	bitFlag += floatEquals(bitIndex, 5.0) * floatGreaterThanOrEqual(byteVal, 4.0);
	byteVal -= floatGreaterThanOrEqual(byteVal, 4.0) * 4.0;
	bitFlag += floatEquals(bitIndex, 6.0) * floatGreaterThanOrEqual(byteVal, 2.0);
	byteVal -= floatGreaterThanOrEqual(byteVal, 2.0) * 2.0;
	bitFlag += floatEquals(bitIndex, 7.0) * floatGreaterThanOrEqual(byteVal, 1.0);

	// flip boolean value
	bitFlag = floatEquals(bitFlag, 0.0);

	// push bit flag into most significant bit of red color channel
	gl_FragColor = vec4(setMSB(0.0, bool(bitFlag)), bitFlag/255.0, 0.0, 0.0);
}