import * as gpu from "../index";
import * as twgl from "twgl.js";
import { glWiretap } from "gl-wiretap";
import { passThruVert } from "../computeShader";
import { createBufferInfoFromArrays } from "../bufferInfo";

gpu.setWebGLContext(require("gl")(1, 1));
const gl = gpu.getWebGLContext();

const width = 8;

const fragSource = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

void main() {
  gl_FragColor = vec4(0.25, 0.25, 0.25, 0.25);
}`;

const vertShader = gl.createShader(gl.VERTEX_SHADER);
if (!vertShader) throw new Error("unable to create new vertex shader");
gl.shaderSource(vertShader, passThruVert.trim());
gl.compileShader(vertShader);
if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
  throw new Error(`could not compile vertex shader: ${gl.getShaderInfoLog(vertShader)}\n\n${passThruVert.trim()}`);

const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
if (!fragShader) throw new Error("unable to create new fragment shader");
gl.shaderSource(fragShader, fragSource.trim());
gl.compileShader(fragShader);
if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
  throw new Error(`could not compile vertex shader: ${gl.getShaderInfoLog(fragShader)}\n\n${fragSource.trim()}`);

const program = gl.createProgram();
if (!program) throw new Error("unable to create program");
gl.attachShader(program, vertShader);
gl.attachShader(program, fragShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS))
  throw new Error(`error in program linking: ${gl.getProgramInfoLog(program)}`);

var attribLocation = -1;
const cnt = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) as number;
for (let idx = 0; idx < cnt; idx++) {
  const activeInfo = gl.getActiveAttrib(program, idx);
  if (activeInfo === null) continue;
  const loc = gl.getAttribLocation(program, activeInfo.name);
  if (loc === null) continue;
  console.debug(`setting to attribLocation to: ${loc}`);
  attribLocation = loc;
}

const srcData = new Uint8Array(width * width * 4).fill(127);
const srcTex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, srcTex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, width, 0, gl.RGBA, gl.UNSIGNED_BYTE, srcData);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

const dstTex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, dstTex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, width, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

const fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dstTex, 0);

const tappedGL = glWiretap(gl);

gpu.setWebGLContext(tappedGL);

// const buffer = tappedGL.createBuffer();
// tappedGL.bindBuffer(gl.ARRAY_BUFFER, buffer);
// tappedGL.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
// tappedGL.bindBuffer(gl.ARRAY_BUFFER, null);

const bufferInfo = createBufferInfoFromArrays({
  a_position: {
    data: new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    numComponents: 2
  }
});

// const bufferInfo = twgl.createBufferInfoFromArrays(tappedGL, {
//   a_position: {
//     data: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1],
//     numComponents: 2
//   }
// });

console.log(tappedGL.toString());

// console.log(bufferInfo);

gl.useProgram(program);

// if (!bufferInfo.attribs) throw new Error("no attributes detected");

gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo["a_position"]["buffer"]);
gl.enableVertexAttribArray(attribLocation);
gl.vertexAttribPointer(attribLocation, 2, gl.FLOAT, false, 0, 0);

gl.viewport(0, 0, width, width);
gl.drawArrays(gl.TRIANGLES, 0, 6);

const dstData = new Uint8Array(width * width * 4);
gl.readPixels(0, 0, width, width, gl.RGBA, gl.UNSIGNED_BYTE, dstData);

console.log(dstData);
