import { getWebGLContext } from "./context";

export interface BufferArraySpecs {
  [key: string]: {
    data: ArrayBuffer | ArrayBufferView;
    numComponents: number;
  };
}

export interface BufferInfo {
  [key: string]: {
    buffer: WebGLBuffer;
    numComponents: number;
  };
}

export function createBufferInfoFromArrays(arrays: BufferArraySpecs) {
  const gl = getWebGLContext();
  const bufferInfo = {} as BufferInfo;
  for (let attribName in arrays) {
    const buffer = gl.createBuffer();
    if (buffer === null) throw new Error("unable to create buffer");
    bufferInfo[attribName] = {
      buffer: buffer,
      numComponents: bufferInfo[attribName]["numComponents"]
    };
  }
  for (let attribName in bufferInfo) {
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo[attribName]["buffer"]);
    gl.bufferData(gl.ARRAY_BUFFER, arrays[attribName]["data"], gl.STATIC_DRAW);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return bufferInfo;
}

var computeBufferInfo: BufferInfo | undefined;

export function getComputeBufferInfo() {
  if (!computeBufferInfo)
    computeBufferInfo = createBufferInfoFromArrays({
      a_position: {
        data: new Float64Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        numComponents: 2
      }
    });
  return computeBufferInfo;
}
