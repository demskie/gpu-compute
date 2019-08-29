#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_scanned;
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

void main() {
	// pull current coordinates and remove bit value
	vec4 currentTexel = texture2D(u_scanned, gl_FragCoord.xy / u_textureWidth);
	bool currentBitFlag = getMSB(currentTexel.r); 
	currentTexel.r = clearMSB(currentTexel.r);
	texint currentValue = texint(int(vec2ToUint16(currentTexel.rg)), int(vec2ToUint16(currentTexel.ba)));

	// calculate previous coordinates
	texint previousFragCoord = texint(int(floor(gl_FragCoord.x)), int(floor(gl_FragCoord.y)));
	previousFragCoord = subtract(previousFragCoord, texint(1, 0), u_textureWidth);
	vec2 previousFragCoordVec = vec2(float(previousFragCoord.x) + 0.5, float(previousFragCoord.y) + 0.5);

	// pull previous coordinates and remove bit value
	vec4 previousTexel = texture2D(u_scanned, previousFragCoordVec / u_textureWidth);
	previousTexel.r = clearMSB(previousTexel.r);
	texint previousValue = texint(int(vec2ToUint16(previousTexel.rg)), int(vec2ToUint16(previousTexel.ba)));

	// pull last coordinates and remove bit value
	vec4 lastTexel = texture2D(u_scanned, vec2(u_textureWidth - 0.5, u_textureWidth - 0.5) / u_textureWidth);
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
			scatterValue = add(scatterValue, lastValue, u_textureWidth);
		} else {
			scatterValue = texint(int(floor(gl_FragCoord.x)), int(floor(gl_FragCoord.y)));
			scatterValue = subtract(scatterValue, previousValue, u_textureWidth);
			scatterValue = add(scatterValue, lastValue, u_textureWidth);
		}
	}

	// output scatter coordinates
	gl_FragColor = vec4(uint16ToVec2(float(scatterValue.x)), uint16ToVec2(float(scatterValue.y)));
}