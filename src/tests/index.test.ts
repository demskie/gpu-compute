import * as gpu from "../index";
import * as example from "./example";
import { RenderTarget } from "../renderTarget";

beforeAll(() => {
  gpu.setWebGLContext(require("gl")(1, 1));
});

test("readme example", () => example.execute());

test("majorly underpacked texture data", () => {
  const target = new RenderTarget(512);
  let i = 8;
  let arr = new BigUint64Array(Array.from(new Array(i), () => BigInt(--i)));
  const input = new Uint8Array(arr.buffer);
  target.pushTextureData(input);
  const output = target.readPixels().slice(0, input.length);
  expect(input).toEqual(output);
});

test("non-rectangular texture data", () => {
  const target = new RenderTarget(512);
  let i = 123 * 321;
  let arr = new BigUint64Array(Array.from(new Array(i), () => BigInt(--i)));
  const input = new Uint8Array(arr.buffer);
  target.pushTextureData(input);
  const output = target.readPixels().slice(0, input.length);
  expect(input).toEqual(output);
});

test("rectangular texture data", () => {
  const target = new RenderTarget(512);
  let i = 128 * 128;
  let arr = new BigUint64Array(Array.from(new Array(i), () => BigInt(--i)));
  const input = new Uint8Array(arr.buffer);
  target.pushTextureData(input);
  const output = target.readPixels().slice(0, input.length);
  expect(input).toEqual(output);
});

test("perfectly packed texture data", () => {
  const target = new RenderTarget(512);
  let i = (512 * 512) / 2;
  let arr = new BigUint64Array(Array.from(new Array(i), () => BigInt(--i)));
  const input = new Uint8Array(arr.buffer);
  target.pushTextureData(input);
  const output = target.readPixels().slice(0, input.length);
  expect(input).toEqual(output);
});
