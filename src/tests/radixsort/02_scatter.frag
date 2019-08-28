#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_scanned;

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

bool getMSB(float);
float clearMSB(float);
float setMSB(float, bool);

struct texint { int x; int y; };
texint add(texint, texint);
texint subtract(texint, texint);
texint zeroize(texint, bool);

void main() {
	// pull current coordinates and remove bit value
	vec4 currentTexel = texture2D(u_scanned, gl_FragCoord.xy / TEXTURE_WIDTH);
	bool currentBitFlag = getMSB(currentTexel.r); 
	currentTexel.r = clearMSB(currentTexel.r);
	texint currentValue = texint(int(vec2ToUint16(currentTexel.rg)), int(vec2ToUint16(currentTexel.ba)));

	// calculate previous coordinates
	texint previousFragCoord = texint(int(floor(gl_FragCoord.x)), int(floor(gl_FragCoord.y)));
	previousFragCoord = subtract(previousFragCoord, texint(1, 0));
	vec2 previousFragCoordVec = vec2(float(previousFragCoord.x) + 0.5, float(previousFragCoord.y) + 0.5);

	// pull previous coordinates and remove bit value
	vec4 previousTexel = texture2D(u_scanned, previousFragCoordVec / TEXTURE_WIDTH);
	previousTexel.r = clearMSB(previousTexel.r);
	texint previousValue = texint(int(vec2ToUint16(previousTexel.rg)), int(vec2ToUint16(previousTexel.ba)));

	// pull last coordinates and remove bit value
	vec4 lastTexel = texture2D(u_scanned, vec2(TEXTURE_WIDTH - 0.5, TEXTURE_WIDTH - 0.5) / TEXTURE_WIDTH);
	lastTexel.r = clearMSB(lastTexel.r);
	texint lastValue = texint(int(vec2ToUint16(lastTexel.rg)), int(vec2ToUint16(lastTexel.ba)));

	// create an empty scatterCoord 
	texint scatterValue = texint(0, 0);

	// gather booleans for upcoming branches
	float isLeftSide = float(currentBitFlag);
	float isFirstTexel = floatEquals(floor(gl_FragCoord.x), 0.0) * floatEquals(floor(gl_FragCoord.y), 0.0);

	// branch based on conditional floats
	if (isLeftSide == 1.0) {
		if (isFirstTexel == 0.0) {
			scatterValue = texint(previousValue.x, previousValue.y);
		}
	} else {
		if (isFirstTexel == 1.0) {
			scatterValue = texint(int(floor(gl_FragCoord.x)), int(floor(gl_FragCoord.y)));
			scatterValue = add(scatterValue, lastValue);
		} else {
			scatterValue = texint(int(floor(gl_FragCoord.x)), int(floor(gl_FragCoord.y)));
			scatterValue = subtract(scatterValue, previousValue);
			scatterValue = add(scatterValue, lastValue);
		}
	}

	// output scatter coordinates
	gl_FragColor = vec4(uint16ToVec2(float(scatterValue.x)), uint16ToVec2(float(scatterValue.y)));
}