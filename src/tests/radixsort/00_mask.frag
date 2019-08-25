#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_indices;
uniform sampler2D u_data;

uniform float u_bitIndex;

const float TEXTURE_WIDTH = 1.0;

float round(float f);
float floatEquals(float f1, float f2);
float floatNotEquals(float f1, float f2);
float floatLessThan(float f1, float f2);
float floatGreaterThan(float f1, float f2);
float floatLessThanOrEqual(float f1, float f2);
float floatGreaterThanOrEqual(float f1, float f2);
float vec2ToUint16(vec2 v);
vec2 uint16ToVec2(float f);
vec2 addToVec2(vec2 v, float f, float w);
void unpackBooleans(float f, inout bool arr[8]);
float packBooleans(bool arr[8]);
bool getMSB(float f);
float clearMSB(float f);
float setMSB(float f, bool b);

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