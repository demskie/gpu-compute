import {
  createBufferInfoFromArrays,
  ProgramInfo,
  TransformFeedbackInfo,
  createUniformSetters,
  createAttributeSetters,
  createTransformFeedbackInfo,
  BufferInfo
} from "twgl.js";

import { getWebGLContext } from "./computeShader";

export const passThruTransposeVert = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
precision mediump sampler2D;
#endif

uniform sampler2D u_scatterCoord;
uniform sampler2D u_sourceTex;
attribute vec2 a_position;
varying vec4 v_colorData;

const float TEXTURE_WIDTH = 1.0;

float vec2ToUint16(vec2 v);
vec2 uint16ToVec2(float f);

void main() {
  gl_PointSize = 1.0;
  gl_Position = vec4(a_position.xy, 0.0, 1.0);
	vec4 scatterTexel = texture2D(u_scatterCoord, a_position.xy);
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

const arrayOfBuffers = new Array(13) as BufferInfo[];

function getBufferInfo(exponent: number) {
  if (exponent < 0 || exponent >= arrayOfBuffers.length)
    throw new Error(`the provided exponent of '${exponent}' is not in range (0 to 12)`);
  if (!arrayOfBuffers[exponent]) {
    const width = Math.pow(2, exponent);
    const arr = new Float32Array(width * width);
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

// export class TranposeShader implements ProgramInfo {}
