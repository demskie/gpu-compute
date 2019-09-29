import * as gpu from "../index";
import * as example from "./example";

gpu.setWebGLContext(require("gl")(1, 1));

describe("sequentially run tests", () => {
  test("readme example", () => example.execute());
});
