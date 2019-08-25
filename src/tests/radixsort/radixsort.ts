import * as gpu from "gpu-compute";
import { TransposeShader } from "gpu-compute/lib/transposeShader";

export function radixSortTest() {
	const maskFrag = require("fs").readFileSync("src/radixsort/00_mask.frag", "utf8");
	const scanFrag = require("fs").readFileSync("src/radixsort/01_scan.frag", "utf8");
	const scatterFrag = require("fs").readFileSync("src/radixsort/02_scatter.frag", "utf8");

	const textureWidth = 4;

	const searchAndReplace = {
		"const float TEXTURE_WIDTH = 1.0;": `const float TEXTURE_WIDTH = ${textureWidth}.0;`,
		"float round(float f);": gpu.functionStrings.round,
		"float floatEquals(float f1, float f2);": gpu.functionStrings.floatEquals,
		"float floatNotEquals(float f1, float f2);": gpu.functionStrings.floatNotEquals,
		"float floatLessThan(float f1, float f2);": gpu.functionStrings.floatLessThan,
		"float floatGreaterThan(float f1, float f2);": gpu.functionStrings.floatGreaterThan,
		"float floatLessThanOrEqual(float f1, float f2);": gpu.functionStrings.floatLessThanOrEqual,
		"float floatGreaterThanOrEqual(float f1, float f2);": gpu.functionStrings.floatGreaterThanOrEqual,
		"float vec2ToInt16(vec2 v);": gpu.functionStrings.vec2ToInt16,
		"vec2 int16ToVec2(float f);": gpu.functionStrings.int16ToVec2,
		"float vec2ToUint16(vec2 v);": gpu.functionStrings.vec2ToUint16,
		"vec2 uint16ToVec2(float f);": gpu.functionStrings.uint16ToVec2,
		"void unpackBooleans(float f, inout bool arr[8]);": gpu.functionStrings.unpackBooleans,
		"float packBooleans(bool arr[8]);": gpu.functionStrings.packBooleans,
		"vec2 addToVec2(vec2 v, float f, float w);": `
		vec2 addToVec2(vec2 v, float f, float w) {
			v.y += floor((v.x + f) / w);
			v.x = mod(v.x + f, w);
			return v;
		}`,
		"bool getMSB(float f);": "bool getMSB(float f) { return bool(floatGreaterThanOrEqual(f * 255.0, 128.0)); }",
		"float clearMSB(float f);":
			"float clearMSB(float f) { return (f * 255.0 - floatGreaterThanOrEqual(f * 255.0, 128.0) * 128.0) / 255.0; }",
		"float setMSB(float f, bool b);":
			"float setMSB(float f, bool b) { return (f * 255.0 + float(b) * floatLessThan(f * 255.0, 128.0) * 128.0) / 255.0; }"
	};

	const indices = new gpu.RenderTarget(textureWidth);
	const data = new gpu.RenderTarget(textureWidth);
	const alpha = new gpu.RenderTarget(textureWidth);

	const maskShader = new gpu.ComputeShader(maskFrag, searchAndReplace);
	const scanShader = new gpu.ComputeShader(scanFrag, searchAndReplace);
	const scatterShader = new gpu.ComputeShader(scatterFrag, searchAndReplace);
	const transposeShader = new TransposeShader(textureWidth);

	indices.pushTextureData(createUint16Indices(textureWidth));

	const arrStrings = [
		"100",
		"111",
		"010",
		"110",
		"011",
		"101",
		"001",
		"000",
		"101",
		"000",
		"110",
		"010",
		"011",
		"001",
		"000",
		"100"
	];
	const arrBytes = [0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0];
	const bytes = new Uint8Array(textureWidth * textureWidth * 4);
	for (var i = 0; i < bytes.length; i += 4) {
		bytes[i + 3] = arrBytes[i / 4];
	}
	data.pushTextureData(bytes);

	let start = Date.now();
	for (var bitIndex = 31; bitIndex >= 0; bitIndex--) {
		alpha.compute(maskShader, { u_indices: indices, u_data: data, u_bitIndex: bitIndex });

		for (var i = 0; Math.pow(2, i) < textureWidth * textureWidth; i++) {
			alpha.compute(scanShader, {
				u_tex: alpha,
				u_offsetX: Math.floor(Math.pow(2, i) % textureWidth),
				u_offsetY: Math.floor(Math.pow(2, i) / textureWidth)
			});
		}

		alpha.compute(scatterShader, { u_scanned: alpha });
		printFragCoordPairs(textureWidth, alpha.readPixels());

		indices.transpose(transposeShader, alpha);
		printFragCoordPairs(textureWidth, indices.readPixels());
		return;
	}
	indices.readPixels();
	console.log(`finished RadixSort in: ${Date.now() - start}ms`);

	indices.delete();
	data.delete();
	alpha.delete();
	maskShader.delete();
	scanShader.delete();
	scatterShader.delete();
	transposeShader.delete();
}

function printFragCoordPairs(width: number, bytes: Uint8Array) {
	let s = "[\n";
	for (var i = 0; i < bytes.length; i += 4) {
		let v = gpu.unpackUint16(bytes[i + 0], bytes[i + 1]) + gpu.unpackUint16(bytes[i + 2], bytes[i + 3]) * width;
		s += `\ti: ${i / 4}  \tv: ${v}\n`;
	}
	console.log(s + "]\n");
}

function printUint16Pairs(width: number, bytes: Uint8Array) {
	let s = "[\n";
	for (var i = 0; i < bytes.length; i += 4) {
		let v = [gpu.unpackUint16(bytes[i + 0], bytes[i + 1]), gpu.unpackUint16(bytes[i + 2], bytes[i + 3])];
		s += `\ti: ${i / 4}  \tp: [ ${v[0]}, ${v[1]} ]\n`;
	}
	console.log(s + "]\n");
}

function printInt16Pairs(width: number, bytes: Uint8Array) {
	let s = "[\n";
	for (var i = 0; i < bytes.length; i += 4) {
		let v = [gpu.unpackInt16(bytes[i + 0], bytes[i + 1]), gpu.unpackInt16(bytes[i + 2], bytes[i + 3])];
		s += `\ti: ${i / 4}  \tp: [ ${v[0]}, ${v[1]} ]\n`;
	}
	console.log(s + "]\n");
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
