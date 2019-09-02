import * as gpu from "../index";

test("radix sort test", () => {
  const maskFrag = require("fs").readFileSync("src/tests/radixsort/01_mask_signed_small.frag", "utf8");
  const scanFrag = require("fs").readFileSync("src/tests/radixsort/02_scan.frag", "utf8");
  const scatterFrag = require("fs").readFileSync("src/tests/radixsort/03_scatter.frag", "utf8");

  const textureWidth = 4;

  const searchAndReplace = {
    "float round(float);": gpu.functionStrings.round,
    "float floatEquals(float, float);": gpu.functionStrings.floatEquals,
    "float floatLessThan(float, float);": gpu.functionStrings.floatLessThan,
    "float floatGreaterThan(float, float);": gpu.functionStrings.floatGreaterThan,
    "float floatLessThanOrEqual(float, float);": gpu.functionStrings.floatLessThanOrEqual,
    "float floatGreaterThanOrEqual(float, float);": gpu.functionStrings.floatGreaterThanOrEqual,
    "float vec2ToUint16(vec2);": gpu.functionStrings.vec2ToUint16,
    "vec2 uint16ToVec2(float);": gpu.functionStrings.uint16ToVec2,

    "bool getMSB(float);": "bool getMSB(float f) { return bool(floatGreaterThanOrEqual(f * 255.0, 128.0)); }",
    "float clearMSB(float);":
      "float clearMSB(float f) { return (f * 255.0 - floatGreaterThanOrEqual(f * 255.0, 128.0) * 128.0) / 255.0; }",
    "float setMSB(float, bool);":
      "float setMSB(float f, bool b) { return (f * 255.0 + float(b) * floatLessThan(f * 255.0, 128.0) * 128.0) / 255.0; }",

    "texint add(texint, texint, float);": `
			texint add(texint a, texint b, float f) {
				texint z = texint(a.x + b.x, a.y + b.y);
				int under = int(floatLessThan(float(a.x + b.x), 0.0));
				int over = int(floatGreaterThanOrEqual(float(a.x + b.x), f));
				z.y = z.y - under + over;
				z.x = z.x + (under - over) * int(f);
				return z;
			}`,
    "texint subtract(texint, texint, float);": `
			texint subtract(texint a, texint b, float f) {
				texint z = texint(a.x - b.x, a.y - b.y);
				int under = int(floatLessThan(float(a.x - b.x), 0.0));
				int over = int(floatGreaterThanOrEqual(float(a.x - b.x), f));
				z.y = z.y - under + over;
				z.x = z.x + (under - over) * int(f);
				return z;
			}`,
    "texint zeroize(texint, bool);": `
			texint zeroize(texint t, bool b) {
				int i = int(floatEquals(float(b), 0.0));
				return texint(t.x * i, t.y * i);
			}`,
    "texint getHalf(texint, float);": `
			texint getHalf(texint t, float w) {
				float xMod = float(t.x) - mod(float(t.x), 2.0);
				float x = floatEquals(mod(float(t.y), 2.0), 0.0) * floor(xMod / 2.0);
	     	x += floatEquals(mod(float(t.y), 2.0), 1.0) * floor(w - (w-xMod) / 2.0);
				return texint(int(x), int(floor(float(t.y / 2))));
			}`,
    "texint getQuarter(texint, float);": `
			texint getQuarter(texint t, float w) {
				return getHalf(getHalf(t, w), w);
			}`,
    "texint getDouble(texint, float);": `
			texint getDouble(texint t, float w) {
				t.y = t.y*2 + ((t.x * 2) / int(w));
				t.x = int(mod(float(t.x * 2), w));
				return t;
			}`,
    "texint getQuadruple(texint, float);": `
			texint getQuadruple(texint t, float w) {
				return getDouble(getDouble(t, w), w);
			}`,
    "texint getOctuple(texint, float);": `
			texint getOctuple(texint t, float w) {
				return getDouble(getDouble(getDouble(t, w), w), w);
			}`,
    "texint getSexdecuple(texint, float);": `
			texint getSexdecuple(texint t, float w) {
				return getDouble(getDouble(getDouble(getDouble(t, w), w), w), w);
			}`,
    "texint toTexint(vec2);": `
			texint toTexint(vec2 v) {
				return texint(int(floor(v.x)), int(floor(v.y)));
			}`,
    "vec2 toVec2(texint);": `
			vec2 toVec2(texint t) {
				return vec2(float(t.x), float(t.y));
			}`
  };

  const indices = new gpu.RenderTarget(textureWidth);
  const data = new gpu.RenderTarget(textureWidth);
  const alpha = new gpu.RenderTarget(textureWidth);

  const maskShader = new gpu.ComputeShader(maskFrag, searchAndReplace);
  const scanShader = new gpu.ComputeShader(scanFrag, searchAndReplace);
  const scatterShader = new gpu.ComputeShader(scatterFrag, searchAndReplace);

  indices.pushTextureData(createUint16Indices(textureWidth));

  const arr = new Int32Array(16);
  arr[0] = 3;
  arr[1] = 78;
  arr[2] = -500;
  arr[3] = 1023;
  arr[4] = 10001;
  arr[5] = 10000;
  arr[6] = 35;
  arr[7] = 528;
  arr[8] = 9;
  arr[9] = 32;
  arr[10] = 52;
  arr[11] = 99;
  arr[12] = 139;
  arr[13] = 2;
  arr[14] = 240;
  arr[15] = 222;
  // for (var i = 0; i < arr.length; i++) {
  //   arr[i] = i + 257;
  // }

  data.pushTextureData(new Uint8Array(arr.buffer));

  // throw new Error(`${data.readPixels()}`);

  for (var offset = 0; offset < 32; offset += 8) {
    for (var bit = 7; bit >= 0; bit--) {
      console.debug(`bitIndex: ${offset + bit}`);

      alpha.compute(maskShader, {
        u_indices: indices,
        u_data: data,
        u_bitIndex: offset + bit,
        u_byteCount: 4,
        u_textureWidth: textureWidth
      });

      for (var i = 0; Math.pow(2, i) < textureWidth * textureWidth; i++) {
        alpha.compute(scanShader, {
          u_tex: alpha,
          u_offsetX: Math.floor(Math.pow(2, i) % textureWidth),
          u_offsetY: Math.floor(Math.pow(2, i) / textureWidth),
          u_textureWidth: textureWidth
        });
      }

      alpha.compute(scatterShader, { u_scanned: alpha, u_textureWidth: textureWidth });

      indices.transpose(alpha);
    }
  }

  const indicesPixels = indices.readPixels();
  const output = reorderInt32Array(arr, indicesPixels, textureWidth);
  throw new Error(`${output}`);

  var last = -1;
  for (var i = 0; i < output.length; i++) {
    if (last > output[i]) throw new Error("output didn't sort properly");
    last = output[i];
  }

  indices.delete();
  data.delete();
  alpha.delete();
  maskShader.delete();
  scanShader.delete();
  scatterShader.delete();
});

function fragCoordPairs(width: number, bytes: Uint8Array) {
  let s = "";
  for (var i = 0; i < bytes.length; i += 4) {
    let x =
      gpu.unpackUint16(bytes[i + 0], bytes[i + 1]) >= 32768
        ? gpu.unpackUint16(bytes[i + 0], bytes[i + 1]) - 32768
        : gpu.unpackUint16(bytes[i + 0], bytes[i + 1]);
    let v = x + gpu.unpackUint16(bytes[i + 2], bytes[i + 3]) * width;
    s += ` ${v}`;
  }
  return s;
}

function createUint16Indices(textureWidth: number) {
  const bytes = new Uint8Array(textureWidth * textureWidth * 4);
  for (var i = 0; i < bytes.length; i += 4) {
    var index = Math.floor(i / 4);
    var xArr = gpu.packUint16(Math.floor(index % textureWidth));
    var yArr = gpu.packUint16(Math.floor(index / textureWidth));
    bytes[i + 0] = xArr[0];
    bytes[i + 1] = xArr[1];
    bytes[i + 2] = yArr[0];
    bytes[i + 3] = yArr[1];
  }
  return bytes;
}

function reorderUint8Array(array: Uint8Array, indices: Uint8Array, width: number) {
  const sorted = new Uint8Array(array.length);
  for (var i = 0; i < indices.length; i += 4) {
    let fragPairIdx =
      gpu.unpackUint16(indices[i + 0], indices[i + 1]) + gpu.unpackUint16(indices[i + 2], indices[i + 3]) * width;
    sorted[Math.floor(i / 4)] = array[fragPairIdx];
  }
  return sorted;
}

function reorderUint16Array(array: Uint16Array, indices: Uint8Array, width: number) {
  const sorted = new Uint16Array(array.length);
  for (var i = 0; i < indices.length; i += 4) {
    let fragPairIdx =
      gpu.unpackUint16(indices[i + 0], indices[i + 1]) + gpu.unpackUint16(indices[i + 2], indices[i + 3]) * width;
    sorted[Math.floor(i / 4)] = array[fragPairIdx];
  }
  return sorted;
}

function reorderUint32Array(array: Uint32Array, indices: Uint8Array, width: number) {
  const sorted = new Uint32Array(array.length);
  for (var i = 0; i < indices.length; i += 4) {
    let fragPairIdx =
      gpu.unpackUint16(indices[i + 0], indices[i + 1]) + gpu.unpackUint16(indices[i + 2], indices[i + 3]) * width;
    sorted[Math.floor(i / 4)] = array[fragPairIdx];
  }
  return sorted;
}

function reorderFloat32Array(array: Float32Array, indices: Uint8Array, width: number) {
  const sorted = new Float32Array(array.length);
  for (var i = 0; i < indices.length; i += 4) {
    let fragPairIdx =
      gpu.unpackUint16(indices[i + 0], indices[i + 1]) + gpu.unpackUint16(indices[i + 2], indices[i + 3]) * width;
    sorted[Math.floor(i / 4)] = array[fragPairIdx];
  }
  return sorted;
}

function reorderInt8Array(array: Int8Array, indices: Uint8Array, width: number) {
  const sorted = new Int8Array(array.length);
  for (var i = 0; i < indices.length; i += 4) {
    let fragPairIdx =
      gpu.unpackUint16(indices[i + 0], indices[i + 1]) + gpu.unpackUint16(indices[i + 2], indices[i + 3]) * width;
    sorted[Math.floor(i / 4)] = array[fragPairIdx];
  }
  return sorted;
}

function reorderInt16Array(array: Int16Array, indices: Uint8Array, width: number) {
  const sorted = new Int16Array(array.length);
  for (var i = 0; i < indices.length; i += 4) {
    let fragPairIdx =
      gpu.unpackUint16(indices[i + 0], indices[i + 1]) + gpu.unpackUint16(indices[i + 2], indices[i + 3]) * width;
    sorted[Math.floor(i / 4)] = array[fragPairIdx];
  }
  return sorted;
}

function reorderInt32Array(array: Int32Array, indices: Uint8Array, width: number) {
  const sorted = new Int32Array(array.length);
  for (var i = 0; i < indices.length; i += 4) {
    let fragPairIdx =
      gpu.unpackUint16(indices[i + 0], indices[i + 1]) + gpu.unpackUint16(indices[i + 2], indices[i + 3]) * width;
    sorted[Math.floor(i / 4)] = array[fragPairIdx];
  }
  return sorted;
}
