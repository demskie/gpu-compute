import * as gpu from "../index";
import { replaceDependencies } from "../functionStrings";

let benchmarking = false;
let results = "PENDING!";

export function isBenchmarking() {
  return benchmarking;
}

// function integerWithCommas(x: number) {
//   return Math.round(x)
//     .toString()
//     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

const process = (s: string) => {
  return replaceDependencies(
    s
      .replace(/\r+/gm, "")
      .replace(/\t/g, "    ")
      .replace(/\n{3,}/g, "\n\n")
  );
};

const additionFrag = require("fs").readFileSync(require.resolve("./benchAddition.glsl"), "utf8"); // prettier-ignore

export async function startBenchmarking() {
  if (!benchmarking) {
    benchmarking = true;
    results = "EXECUTING FOO";
    setTimeout(() => {
      benchmarking = false;
      results = process(additionFrag);
    }, 2500);
  }
}

export function getBenchmarkText() {
  return results;
}

export function getWebGLContext() {
  return gpu.getWebGLContext();
}

export default {
  startBenchmarking,
  getBenchmarkText,
  isBenchmarking,
  getWebGLContext
};
