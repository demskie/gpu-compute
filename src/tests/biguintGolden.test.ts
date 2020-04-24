import * as gpu from "../index";
import { readFileSync } from "fs";
import { declarationToDefinition } from "../shaders/biguint/biguint";
import { unroll } from "../unroll";

beforeAll(() => {
  gpu.setWebGLContext(require("gl")(1, 1));
});

function readAndReplace(s: string, byteCount: number) {
  for (let [key, val] of Object.entries(declarationToDefinition)) {
    s = s.replace(key, val);
  }
  s = s.replace(/#ifndef BYTE_COUNT\n#define BYTE_COUNT 16\n#endif/g, "");
  s = s.replace(/#define BYTE_COUNT 16/g, "");
  s = s.replace(/BYTE_COUNT/g, `${byteCount}`);
  // s = unroll(s, false);
  // s = unroll(s, true);
  return s;
}

test("add compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestAdd.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'add' compile time: ${Date.now() - t}ms`);
});

test("and compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestAnd.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'and' compile time: ${Date.now() - t}ms`);
});

test("div compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestDiv.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'div' compile time: ${Date.now() - t}ms`);
});

test("lshift compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestLshift.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'lshift' compile time: ${Date.now() - t}ms`);
});

test("mod compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestMod.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'mod' compile time: ${Date.now() - t}ms`);
});

test("mul compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestMul.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'mul' compile time: ${Date.now() - t}ms`);
});

test("or compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestOr.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'or' compile time: ${Date.now() - t}ms`);
});

test("pow compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestPow.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'pow' compile time: ${Date.now() - t}ms`);
});

test("rshift compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestRshift.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'rshift' compile time: ${Date.now() - t}ms`);
});

// test("sqrt compilation time", () => {
//   const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestSqrt.frag"), "utf8"), 16);
//   let t = Date.now();
//   new gpu.ComputeShader(x);
//   console.error(`'sqrt' compile time: ${Date.now() - t}ms`);
// });

test("sub compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestSub.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'sub' compile time: ${Date.now() - t}ms`);
});

test("xor compilation time", () => {
  const x = readAndReplace(readFileSync(require.resolve("./shaders/biguintTestXor.frag"), "utf8"), 16);
  let t = Date.now();
  new gpu.ComputeShader(x);
  console.error(`'xor' compile time: ${Date.now() - t}ms`);
});

test("golden test", () => {
  // TODO
});
