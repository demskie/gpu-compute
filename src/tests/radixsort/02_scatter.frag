#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_scanned;

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
	// pull current coordinates and remove bit value
	vec4 currentTexel = texture2D(u_scanned, gl_FragCoord.xy / TEXTURE_WIDTH);
	bool currentBitFlag = getMSB(currentTexel.r); 
	currentTexel.r = clearMSB(currentTexel.r);
	vec2 currentValue = vec2(vec2ToUint16(currentTexel.rg), vec2ToUint16(currentTexel.ba));

	// calculate previous coordinates
	vec2 previousFragCoord = addToVec2(vec2(floor(gl_FragCoord.x), floor(gl_FragCoord.y)), -1.0, TEXTURE_WIDTH);

	// pull previous coordinates and remove bit value
	vec4 previousTexel = texture2D(u_scanned, vec2(previousFragCoord.x + 0.5, previousFragCoord.y + 0.5) / TEXTURE_WIDTH);
	previousTexel.r = clearMSB(previousTexel.r);
	vec2 previousValue = vec2(vec2ToUint16(previousTexel.rg), vec2ToUint16(previousTexel.ba));

	// pull last coordinates and remove bit value
	vec4 lastTexel = texture2D(u_scanned, vec2(TEXTURE_WIDTH - 0.5, TEXTURE_WIDTH - 0.5) / TEXTURE_WIDTH);
	lastTexel.r = clearMSB(lastTexel.r);
	vec2 lastValue = vec2(vec2ToUint16(lastTexel.rg), vec2ToUint16(lastTexel.ba));

	// create an empty scatterCoord 
	vec2 scatterCoord = vec2(0.0, 0.0);

	// gather booleans for upcoming branches
	float isLeftSide = float(currentBitFlag);
	float isFirstTexel = floatEquals(floor(gl_FragCoord.x), 0.0) * floatEquals(floor(gl_FragCoord.y), 0.0);

	// branch based on conditional floats
	if (isLeftSide == 1.0) {
		if (isFirstTexel == 0.0) {
			scatterCoord.x = previousValue.x;
			scatterCoord.y = previousValue.y;
		}
	} else {
		if (isFirstTexel == 1.0) {
			scatterCoord.x = floor(gl_FragCoord.x);
			scatterCoord.y = floor(gl_FragCoord.y);
			float combinedX = mod(scatterCoord.x + previousValue.x, TEXTURE_WIDTH);
			float combinedY = scatterCoord.y + previousValue.y;
			combinedY += floatGreaterThanOrEqual(scatterCoord.x + previousValue.x, TEXTURE_WIDTH);
			scatterCoord.x = combinedX;
			scatterCoord.y = combinedY;
		} else {
			scatterCoord.x = floor(gl_FragCoord.x);
			scatterCoord.y = floor(gl_FragCoord.y);
			float subtractedX = mod(scatterCoord.x - previousValue.x, TEXTURE_WIDTH);
			float subtractedY = scatterCoord.y - previousValue.y;
			subtractedY -= floatLessThan(scatterCoord.x - previousValue.x, 0.0);
			scatterCoord.x = subtractedX;
			scatterCoord.y = subtractedY;
			float combinedX = mod(scatterCoord.x + lastValue.x, TEXTURE_WIDTH);
			float combinedY = scatterCoord.y + lastValue.y;
			combinedY += floatGreaterThanOrEqual(scatterCoord.x + lastValue.x, TEXTURE_WIDTH);
			scatterCoord.x = combinedX;
			scatterCoord.y = combinedY;
		}
	}

	// output scatter coordinates
	gl_FragColor = vec4(uint16ToVec2(scatterCoord.x), uint16ToVec2(scatterCoord.y));
}