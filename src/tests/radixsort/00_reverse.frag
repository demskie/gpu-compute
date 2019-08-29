#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_data;
uniform float u_textureWidth;

void main() {
  vec4 texel = texture2D(u_data, gl_FragCoord.xy / u_textureWidth);
  gl_FragColor = vec4(texel.a, texel.b, texel.g, texel.r);
}