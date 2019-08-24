export const passThruTransposeVert = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_scatterCoord;
uniform sampler2D u_sourceTex;
attribute vec2 position;
varying vec4 v_colorData;

const float TEXTURE_WIDTH = 1.0;

float vec2ToUint16(vec2 v);
vec2 uint16ToVec2(float f);

void main() {
	gl_Position = vec4(position.xy, 0.0, 1.0);
	vec4 scatterTexel = texture2D(u_scatterCoord, position.xy);
	vec2 scatterCoord = vec2(vec2ToUint16(scatterTexel.rg) + 0.5, 
							 vec2ToUint16(scatterTexel.ba) + 0.5);
	v_colorData = texture2D(u_sourceTex, scatterCoord.xy / TEXTURE_WIDTH);
}`;

export const passThruTransposeFrag = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

varying vec4 v_colorData;

void main() {
	gl_FragColor = v_colorData;
}`;

// gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
