// reference: https://play.golang.org/p/7K59UK0wVt2
// safe gpu range of integer values: -65536 to 65536

export const MAX_UINT16 = 65535;
export const MIN_UINT16 = 0;

// unpack range: 0 to 65535
export function unpackUint16(a: number, b: number) {
  a = Math.min(Math.max(0, Math.floor(a)), 255);
  b = Math.min(Math.max(0, Math.floor(b)), 255);
  return a * 256 + b;
}

// pack range: 0 to 65535
export function packUint16(f: number) {
  var arr = new Array(2) as number[];
  f = Math.min(Math.max(0, Math.round(f)), 65535);
  arr[0] = Math.floor(f / 256);
  arr[1] = f - arr[0] * 256;
  return arr;
}
