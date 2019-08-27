import * as gpu from "../index";

test("radix sort test", () => {
  const maskFrag = require("fs").readFileSync("src/tests/radixsort/00_mask.frag", "utf8");
  const scanFrag = require("fs").readFileSync("src/tests/radixsort/01_scan.frag", "utf8");
  const scatterFrag = require("fs").readFileSync("src/tests/radixsort/02_scatter.frag", "utf8");

  const textureWidth = 4;

  const searchAndReplace = {
    "const float TEXTURE_WIDTH = 1.0;": `const float TEXTURE_WIDTH = ${textureWidth}.0;`,
    "float round(float);": gpu.functionStrings.round,
    "float floatEquals(float, float);": gpu.functionStrings.floatEquals,
    "float floatNotEquals(float, float);": gpu.functionStrings.floatNotEquals,
    "float floatLessThan(float, float);": gpu.functionStrings.floatLessThan,
    "float floatGreaterThan(float, float);": gpu.functionStrings.floatGreaterThan,
    "float floatLessThanOrEqual(float, float);": gpu.functionStrings.floatLessThanOrEqual,
    "float floatGreaterThanOrEqual(float, float);": gpu.functionStrings.floatGreaterThanOrEqual,
    "float vec2ToInt16(vec2);": gpu.functionStrings.vec2ToInt16,
    "vec2 int16ToVec2(float);": gpu.functionStrings.int16ToVec2,
    "float vec2ToUint16(vec2);": gpu.functionStrings.vec2ToUint16,
    "vec2 uint16ToVec2(float);": gpu.functionStrings.uint16ToVec2,
    "void unpackBooleans(float, inout bool [8]);": gpu.functionStrings.unpackBooleans,
    "float packBooleans(bool [8]);": gpu.functionStrings.packBooleans,

    "bool getMSB(float);": "bool getMSB(float f) { return bool(floatGreaterThanOrEqual(f * 255.0, 128.0)); }",
    "float clearMSB(float);":
      "float clearMSB(float f) { return (f * 255.0 - floatGreaterThanOrEqual(f * 255.0, 128.0) * 128.0) / 255.0; }",
    "float setMSB(float, bool);":
      "float setMSB(float f, bool b) { return (f * 255.0 + float(b) * floatLessThan(f * 255.0, 128.0) * 128.0) / 255.0; }",

    "texint add(texint, texint);": `
			texint add(texint a, texint b) {
				texint z = texint(a.x + b.x, a.y + b.y);
				int under = int(floatLessThan(float(a.x + b.x), 0.0));
				int over = int(floatGreaterThanOrEqual(float(a.x + b.x), TEXTURE_WIDTH));
				z.y = z.y - under + over;
				z.x = z.x + (under - over) * int(TEXTURE_WIDTH);
				return z;
			}`,
    "texint subtract(texint, texint);": `
			texint subtract(texint a, texint b) {
				texint z = texint(a.x - b.x, a.y - b.y);
				int under = int(floatLessThan(float(a.x - b.x), 0.0));
				int over = int(floatGreaterThanOrEqual(float(a.x - b.x), TEXTURE_WIDTH));
				z.y = z.y - under + over;
				z.x = z.x + (under - over) * int(TEXTURE_WIDTH);
				return z;
			}`,
    "texint zeroize(texint, bool);": `
			texint zeroize(texint t, bool b) {
				int i = int(floatEquals(float(b), 0.0));
				return texint(t.x * i, t.y * i);
			}`
  };

  const indices = new gpu.RenderTarget(textureWidth);
  const data = new gpu.RenderTarget(textureWidth);
  const alpha = new gpu.RenderTarget(textureWidth);

  const maskShader = new gpu.ComputeShader(maskFrag, searchAndReplace);
  const scanShader = new gpu.ComputeShader(scanFrag, searchAndReplace);
  const scatterShader = new gpu.ComputeShader(scatterFrag, searchAndReplace);
  const transposeShader = new gpu.TransposeShader(textureWidth);

  indices.pushTextureData(createUint16Indices(textureWidth));

  let arr = [];
  arr.push(0, 0, 0, 25); // 0
  arr.push(0, 0, 0, 157); // 1
  arr.push(0, 0, 0, 31); // 2
  arr.push(0, 0, 0, 67); // 3
  arr.push(0, 0, 0, 104); // 4
  arr.push(0, 0, 0, 106); // 5
  arr.push(0, 0, 0, 173); // 6
  arr.push(0, 0, 0, 240); // 7
  arr.push(0, 0, 0, 44); // 8
  arr.push(0, 0, 0, 226); // 9
  arr.push(0, 0, 0, 170); // 10
  arr.push(0, 0, 0, 82); // 11
  arr.push(0, 0, 0, 160); // 12
  arr.push(0, 0, 0, 56); // 13
  arr.push(0, 0, 0, 83); // 14
  arr.push(0, 0, 0, 165); // 15

  data.pushTextureData(new Uint8Array(arr));

  // throw new Error(bytes.toString());

  let start = Date.now();
  for (var bitIndex = 31; bitIndex >= 0; bitIndex--) {
    console.error(`bitIndex: ${bitIndex}`);
    alpha.compute(maskShader, { u_indices: indices, u_data: data, u_bitIndex: bitIndex });

    for (var i = 0; Math.pow(2, i) < textureWidth * textureWidth; i++) {
      alpha.compute(scanShader, {
        u_tex: alpha,
        u_offsetX: Math.floor(Math.pow(2, i) % textureWidth),
        u_offsetY: Math.floor(Math.pow(2, i) / textureWidth)
      });
    }
    printFragCoordPairs(textureWidth, alpha.readPixels());

    alpha.compute(scatterShader, { u_scanned: alpha });
    printFragCoordPairs(textureWidth, alpha.readPixels());

    indices.transpose(transposeShader, alpha);
    printFragCoordPairs(textureWidth, indices.readPixels());
  }

  console.log(`finished RadixSort in: ${Date.now() - start}ms`);

  indices.delete();
  data.delete();
  alpha.delete();
  maskShader.delete();
  scanShader.delete();
  scatterShader.delete();
  transposeShader.delete();
});

function printFragCoordPairs(width: number, bytes: Uint8Array) {
  let s = "";
  for (var i = 0; i < bytes.length; i += 4) {
    let v = gpu.unpackUint16(bytes[i + 0], bytes[i + 1]) + gpu.unpackUint16(bytes[i + 2], bytes[i + 3]) * width;
    s += `(i:${i / 4} v:${v}) `;
  }
  console.error(s);
}

function printUint16Pairs(width: number, bytes: Uint8Array) {
  let s = "[\n";
  for (var i = 0; i < bytes.length; i += 4) {
    let v = [gpu.unpackUint16(bytes[i + 0], bytes[i + 1]), gpu.unpackUint16(bytes[i + 2], bytes[i + 3])];
    s += `\ti: ${i / 4}  \tp: [ ${v[0]}, ${v[1]} ]\n`;
  }
  console.error(s + "]\n");
}

function printInt16Pairs(width: number, bytes: Uint8Array) {
  let s = "[\n";
  for (var i = 0; i < bytes.length; i += 4) {
    let v = [gpu.unpackInt16(bytes[i + 0], bytes[i + 1]), gpu.unpackInt16(bytes[i + 2], bytes[i + 3])];
    s += `\ti: ${i / 4}  \tp: [ ${v[0]}, ${v[1]} ]\n`;
  }
  console.error(s + "]\n");
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

function reorderArrayUsingIndices(width: number, array: number[], indices: Uint8Array) {
  const sorted = new Array(array.length) as number[];
  for (var i = 0; i < indices.length; i += 4) {
    let idx =
      gpu.unpackUint16(indices[i + 0], indices[i + 1]) + gpu.unpackUint16(indices[i + 2], indices[i + 3]) * width;
    sorted[i / 4] = array[idx];
  }
  return sorted;
}
