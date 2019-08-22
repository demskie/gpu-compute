// reference: https://play.golang.org/p/p6_Uo0VWLER

export function unpackBooleans(n: number) {
  var arr = new Array(8) as boolean[];
  n = Math.min(Math.max(0, Math.round(n)), 255);
  for (var z = 0; z < 8; z++) {
    var p = Math.pow(2, 7 - z);
    if (n >= p) {
      arr[z] = true;
      n -= p;
    } else {
      arr[z] = false;
    }
  }
  return arr;
}

export function packBooleans(b: boolean[]) {
  var n = 0;
  for (var z = 0; z < 8; z++) {
    if (b.length > z && b[z]) {
      n += Math.pow(2, 7 - z);
    }
  }
  return n;
}
