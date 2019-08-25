import * as gpu from "../index";
import { getWebGLContext } from "../computeShader";

const textureWidth = 4;

const passThruTransposeVert = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_scatterCoord;
uniform sampler2D u_sourceTex;
attribute vec2 a_position;
varying vec4 v_colorData;

const float TEXTURE_WIDTH = ${textureWidth}.0;

${gpu.functionStrings.vec2ToUint16}
${gpu.functionStrings.uint16ToVec2}

void main() {
  gl_PointSize = 1.0;
  gl_Position = vec4(a_position.xy / TEXTURE_WIDTH, 0.0, 1.0);
	vec4 scatterTexel = texture2D(u_scatterCoord, a_position.xy / TEXTURE_WIDTH);
	vec2 scatterCoord = vec2(vec2ToUint16(scatterTexel.rg) + 0.5, 
							             vec2ToUint16(scatterTexel.ba) + 0.5);
  v_colorData = texture2D(u_sourceTex, a_position.xy / TEXTURE_WIDTH);
  v_colorData = vec4(a_position.xy / TEXTURE_WIDTH, 1.0, 1.0);
}`;

const passThruTransposeFrag = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

varying vec4 v_colorData;

void main() {
	gl_FragColor = v_colorData;
}`;

const tpoints = new Float32Array(2 * textureWidth * textureWidth);
var i = 0;
for (var y = 0; y < textureWidth; y++) {
  for (var x = 0; x < textureWidth; x++) {
    tpoints[i++] = (2 * (x + 0.5)) / textureWidth - 1;
    tpoints[i++] = (2 * (y + 0.5)) / textureWidth - 1;
  }
}

test("transpose", () => {
  const tpointsArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const indicesArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const scatterArr = [0, 9, 1, 2, 10, 11, 12, 3, 13, 4, 5, 6, 14, 15, 7, 8];

  // const tpoints = new Float32Array(2 * tpointsArr.length);
  // for (var i = 0; i < tpointsArr.length; i++) {
  //   tpoints[2 * i + 0] = Math.floor(tpointsArr[i] % textureWidth) + 0.5;
  //   tpoints[2 * i + 1] = Math.floor(tpointsArr[i] / textureWidth) + 0.5;
  // }
  const indices = new Uint8Array(4 * indicesArr.length);
  for (var i = 0; i < indicesArr.length; i++) {
    let packedX = gpu.packUint16(Math.floor(indicesArr[i] % textureWidth));
    indices[4 * i + 0] = packedX[0];
    indices[4 * i + 1] = packedX[1];
    let packedY = gpu.packUint16(Math.floor(indicesArr[i] / textureWidth));
    indices[4 * i + 2] = packedY[0];
    indices[4 * i + 3] = packedY[1];
  }
  const scatter = new Uint8Array(4 * scatterArr.length);
  for (var i = 0; i < scatterArr.length; i++) {
    let packedX = gpu.packUint16(Math.floor(scatterArr[i] % textureWidth));
    scatter[4 * i + 0] = packedX[0];
    scatter[4 * i + 1] = packedX[1];
    let packedY = gpu.packUint16(Math.floor(scatterArr[i] / textureWidth));
    scatter[4 * i + 2] = packedY[0];
    scatter[4 * i + 3] = packedY[1];
  }

  throw new Error(`${tpoints}`);

  // setup shaders
  const gl = getWebGLContext();
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, passThruTransposeVert);
  gl.compileShader(vertexShader);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, passThruTransposeFrag);
  gl.compileShader(fragmentShader);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.useProgram(null);
    if (program) gl.deleteProgram(program);
    throw new Error(`shader program did not link successfully: ${gl.getProgramInfoLog(program)}`);
  }
  gl.useProgram(program);
  gl.viewport(0, 0, textureWidth, textureWidth);

  // create target texture
  const targetTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, targetTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureWidth, textureWidth, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // Create and bind the framebuffer
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  // attach the texture as the first color attachment
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);

  // lookup locations
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const scatterCoordLocation = gl.getUniformLocation(program, "u_scatterCoord");
  const sourceTexLocation = gl.getUniformLocation(program, "u_sourceTex");

  // initialize attributes
  gl.enableVertexAttribArray(positionLocation);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, tpoints, gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // initialize uniforms
  const scatterTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, scatterTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureWidth, textureWidth, 0, gl.RGBA, gl.UNSIGNED_BYTE, scatter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const sourceTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, sourceTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureWidth, textureWidth, 0, gl.RGBA, gl.UNSIGNED_BYTE, indices);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // assign texture units
  gl.uniform1i(scatterCoordLocation, gl.TEXTURE1);
  gl.uniform1i(sourceTexLocation, gl.TEXTURE2);

  // render
  gl.drawArrays(gl.POINTS, 0, textureWidth * textureWidth);

  // look at results
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  const output = new Uint8Array(textureWidth * textureWidth * 4);
  gl.readPixels(0, 0, textureWidth, textureWidth, gl.RGBA, gl.UNSIGNED_BYTE, output);
  expect(output).toEqual(true);
});
