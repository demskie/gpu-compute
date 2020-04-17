import * as gpu from "../index";
import { readFileSync } from "fs";
import { declarationToDefinition } from "../shaders/biguint/biguint";

beforeAll(() => {
  gpu.setWebGLContext(require("gl")(1, 1));
});

test("golden test", () => {
  const symbolToShader = {
    /*
    "+": new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestAdd.frag"), "utf8"),
      declarationToDefinition
    ),
    "-": new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestSub.frag"), "utf8"),
      declarationToDefinition
    ),
    */

    "*": new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestMul.frag"), "utf8"),
      declarationToDefinition
    )
    /*
    "/": new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestDiv.frag"), "utf8"),
      declarationToDefinition
    ),
    "%": new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestMod.frag"), "utf8"),
      declarationToDefinition
    ),
    "&": new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestAnd.frag"), "utf8"),
      declarationToDefinition
    ),
    "|": new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestOr.frag"), "utf8"),
      declarationToDefinition
    ),
    "^": new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestXor.frag"), "utf8"),
      declarationToDefinition
    ),
    p: new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestPow.frag"), "utf8"),
      declarationToDefinition
    ),
    "<": new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestLshift.frag"), "utf8"),
      declarationToDefinition
    ),
    ">": new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestRshift.frag"), "utf8"),
      declarationToDefinition
    ),
    sqrt: new gpu.ComputeShader(
      readFileSync(require.resolve("./shaders/biguintTestSqrt.frag"), "utf8"),
      declarationToDefinition
    )
    */
  };
});
