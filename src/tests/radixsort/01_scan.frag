#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_tex;
uniform float u_offsetX;
uniform float u_offsetY;

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
	// pull current value and remove bit value
	vec4 currentTexel = texture2D(u_tex, gl_FragCoord.xy / TEXTURE_WIDTH);
	bool currentBitFlag = getMSB(currentTexel.r);
	currentTexel.r = clearMSB(currentTexel.r);
	texint currentValue = texint(int(vec2ToUint16(currentTexel.rg)), int(vec2ToUint16(currentTexel.ba)));

	// determine offset coordinates
	texint offsetFragCoord = texint(int(floor(gl_FragCoord.x)), int(floor(gl_FragCoord.y)));
	offsetFragCoord = subtract(offsetFragCoord, texint(int(floor(u_offsetX)), int(floor(u_offsetY))));
	vec2 offsetFragCoordVec = vec2(float(offsetFragCoord.x) + 0.5, float(offsetFragCoord.y) + 0.5);

	// pull offset value and remove bit value
	vec4 offsetTexel = texture2D(u_tex, offsetFragCoordVec / TEXTURE_WIDTH);
	bool offsetBitFlag = getMSB(offsetTexel.r);
	offsetTexel.r = clearMSB(offsetTexel.r);
	texint offsetValue = texint(int(vec2ToUint16(offsetTexel.rg)), int(vec2ToUint16(offsetTexel.ba)));

	// zeroize offsetValue if it is invalid
	offsetValue = zeroize(offsetValue, bool(floatLessThan(float(offsetFragCoord.y), 0.0)));

	// add previous coordinates to current coordinates
	currentValue = add(currentValue, offsetValue);

	// inject bit value into currentCoordinates
	vec2 redGreen = uint16ToVec2(float(currentValue.x));
	redGreen.r = setMSB(redGreen.r, currentBitFlag);
	
	// output resulting value
	gl_FragColor = vec4(redGreen.rg, uint16ToVec2(float(currentValue.y)));
}