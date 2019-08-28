import { createBufferInfoFromArrays, BufferInfo } from "twgl.js";

import { getWebGLContext, ComputeShader } from "./computeShader";
import { functionStrings } from "./functionStrings";

export const passThruTransposeVert = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_scatterCoord;
uniform sampler2D u_sourceTex;
attribute vec2 a_position;
varying vec4 v_sourceTexel;

const float TEXTURE_WIDTH = 1.0;

float vec2ToUint16(vec2 v);

void main() {
  gl_PointSize = 1.0;
  vec4 destinationTexel = texture2D(u_scatterCoord, vec2(a_position.x + 1.0, a_position.y + 1.0) / 2.0);
  vec2 destinationCoord = vec2(vec2ToUint16(destinationTexel.rg) + 0.5, vec2ToUint16(destinationTexel.ba) + 0.5);
  gl_Position = vec4(2.0 * (destinationCoord.xy / TEXTURE_WIDTH) - vec2(1.0, 1.0), 0.0, 1.0);
  v_sourceTexel = texture2D(u_sourceTex, vec2(a_position.x + 1.0, a_position.y + 1.0) / 2.0);
}`;

export const passThruTransposeFrag = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

varying vec4 v_sourceTexel;

void main() {
  gl_FragColor = v_sourceTexel;
}`;

const arrayOfBuffers = new Array(13) as BufferInfo[];

export function getTransposeBufferInfo(width: number) {
  if (width < 2 || width > 4096) throw new Error(`width of '${width}' is out of range (2 to 4096)`);
  const exponent = Math.log(width) / Math.log(2);
  if (exponent % 1 !== 0) throw new Error(`width of '${width}' is not a power of two`);
  if (!arrayOfBuffers[exponent]) {
    const width = Math.pow(2, exponent);
    const arr = new Float32Array(2 * width * width);
    var i = 0;
    for (var y = 0; y < width; y++) {
      for (var x = 0; x < width; x++) {
        arr[i++] = (2 * (x + 0.5)) / width - 1;
        arr[i++] = (2 * (y + 0.5)) / width - 1;
      }
    }
    const bufferInfo = createBufferInfoFromArrays(getWebGLContext(), {
      a_position: {
        data: arr,
        numComponents: 2
      }
    });
    arrayOfBuffers[exponent] = bufferInfo;
  }
  return arrayOfBuffers[exponent];
}

const arrayOfShaders = new Array(13) as ComputeShader[];

export function getTransposeShader(width: number) {
  if (width < 2 || width > 4096) throw new Error(`width of '${width}' is out of range (2 to 4096)`);
  const exponent = Math.log(width) / Math.log(2);
  if (exponent % 1 !== 0) throw new Error(`width of '${width}' is not a power of two`);
  if (!arrayOfShaders[exponent]) {
    const gl = getWebGLContext();
    const maxVertexTex = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    if (maxVertexTex < 2) {
      throw new Error(`MAX_VERTEX_TEXTURE_IMAGE_UNITS: '${maxVertexTex}' is less than 2`);
    }
    const stringVars = {
      "const float TEXTURE_WIDTH = 1.0;": `const float TEXTURE_WIDTH = ${width}.0;`,
      "float vec2ToUint16(vec2 v);": functionStrings.vec2ToUint16
    };
    arrayOfShaders[exponent] = new ComputeShader(passThruTransposeFrag, stringVars, passThruTransposeVert);
  }
  return arrayOfShaders[exponent];
}
