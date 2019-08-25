#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_tex;

uniform float u_offsetX;
uniform float u_offsetY;

const float TEXTURE_WIDTH = 1.0;

float round(float f);
float floatEquals(float f1, float f2);
float floatNotEquals(float f1, float f2);
float floatLessThan(float f1, float f2);
float floatGreaterThan(float f1, float f2);
float floatLessThanOrEqual(float f1, float f2);
float floatGreaterThanOrEqual(float f1, float f2);
float vec2ToInt16(vec2 v);
vec2 int16ToVec2(float f);
float vec2ToUint16(vec2 v);
vec2 uint16ToVec2(float f);
vec2 addToVec2(vec2 v, float f, float w);
void unpackBooleans(float f, inout bool arr[8]);
float packBooleans(bool arr[8]);
bool getMSB(float f);
float clearMSB(float f);
float setMSB(float f, bool b);

void main() {
	// pull current value and remove bit value
	vec4 currentTexel = texture2D(u_tex, gl_FragCoord.xy / TEXTURE_WIDTH);
	bool currentBitFlag = getMSB(currentTexel.r);
	currentTexel.r = clearMSB(currentTexel.r);
	vec2 currentValue = vec2(vec2ToUint16(currentTexel.rg), vec2ToUint16(currentTexel.ba));

	// determine offset coordinates
	vec2 offsetFragCoord = addToVec2(vec2(floor(gl_FragCoord.x), floor(gl_FragCoord.y)), -u_offsetX, TEXTURE_WIDTH);
	offsetFragCoord.y -= u_offsetY;

	// pull offset value and remove bit value
	vec4 offsetTexel = texture2D(u_tex, vec2(offsetFragCoord.x + 0.5, offsetFragCoord.y + 0.5) / TEXTURE_WIDTH);
	bool offsetBitFlag = getMSB(offsetTexel.r); 
	offsetTexel.r = clearMSB(offsetTexel.r);
	vec2 offsetValue = vec2(vec2ToUint16(offsetTexel.rg), vec2ToUint16(offsetTexel.ba));

	// zeroize offsetValue if it is invalid
	offsetValue *= floatGreaterThanOrEqual(floor(offsetFragCoord.y), 0.0);

	// add previous coordinates to current coordinates
	float combinedX = mod(currentValue.x + offsetValue.x, TEXTURE_WIDTH);
	float combinedY = floatGreaterThanOrEqual(currentValue.x + offsetValue.x, TEXTURE_WIDTH);
	combinedY += currentValue.y + offsetValue.y;

	// inject bit value into currentCoordinates
	vec2 redGreen = uint16ToVec2(combinedX);
	redGreen.r = setMSB(redGreen.r, currentBitFlag);
	
	// output resulting value
	gl_FragColor = vec4(redGreen.rg, uint16ToVec2(combinedY));
}