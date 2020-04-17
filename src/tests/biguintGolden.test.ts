import * as gpu from "../index";
import { readFileSync } from "fs";
import { declarationToDefinition } from "../shaders/biguint/biguint";

beforeAll(() => {
  gpu.setWebGLContext(require("gl")(1, 1));
});

/*
let addShader = {} as gpu.ComputeShader;
test("add compilation time", () => {
  addShader = new gpu.ComputeShader(
    readFileSync(require.resolve("./shaders/biguintTestAdd.frag"), "utf8"),
    declarationToDefinition
  );
});

let subShader = {} as gpu.ComputeShader;
test("subtract compilation time", () => {
  subShader = new gpu.ComputeShader(
    readFileSync(require.resolve("./shaders/biguintTestSub.frag"), "utf8"),
    declarationToDefinition
  );
});

let mulShader = {} as gpu.ComputeShader;
test("multiply compilation time", () => {
  mulShader = new gpu.ComputeShader(
    readFileSync(require.resolve("./shaders/biguintTestMul.frag"), "utf8"),
    declarationToDefinition
  );
});
*/

let divShader = {} as gpu.ComputeShader;
test("divide compilation time", () => {
  divShader = new gpu.ComputeShader(
    readFileSync(require.resolve("./shaders/biguintTestDiv.frag"), "utf8"),
    declarationToDefinition
  );
});

let modShader = {} as gpu.ComputeShader;
let andShader = {} as gpu.ComputeShader;
let orShader = {} as gpu.ComputeShader;
let xorShader = {} as gpu.ComputeShader;
let powShader = {} as gpu.ComputeShader;
let lshiftShader = {} as gpu.ComputeShader;
let rshiftShader = {} as gpu.ComputeShader;
let sqrtShader = {} as gpu.ComputeShader;

test("golden test", () => {
  // TODO
});
