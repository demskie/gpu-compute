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

export async function startBenchmarking() {
  if (!benchmarking) {
    benchmarking = true;
    results = "EXECUTING FOO";
    setTimeout(() => {
      benchmarking = false;
      results = "FINISHED EXECUTING FOO";
    }, 2500);
  }
}

export function getBenchmarkText() {
  return results;
}

export default {
  startBenchmarking,
  getBenchmarkText,
  isBenchmarking
};
