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
float floatNotEquals(float, float);
float floatLessThan(float, float);
float floatGreaterThan(float, float);
float floatLessThanOrEqual(float, float);
float floatGreaterThanOrEqual(float, float);
float vec2ToInt16(vec2);
vec2 int16ToVec2(float);
float vec2ToUint16(vec2);
vec2 uint16ToVec2(float);
void unpackBooleans(float, inout bool [8]);
float packBooleans(bool [8]);

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
	bool boolArray[8];
	unpackBooleans(byte, boolArray);
	bool bitFlag = boolArray[int(mod(u_bitIndex, 8.0))];

	// flip boolean value
	bitFlag = bool(floatEquals(float(bitFlag), 0.0));

	// push bit flag into most significant bit of red color channel
	gl_FragColor = vec4(setMSB(0.0, bitFlag), float(bitFlag) / 255.0, 0.0, 0.0);
}