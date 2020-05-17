export function flipBits(bytes: Uint8Array) {
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = 255 - bytes[i];
  }
}

export function addOne(bytes: Uint8Array) {
  let carry = 1;
  for (let i = 0; i < bytes.length; i++) {
    let v = bytes[i] + carry;
    if (v <= 255) {
      carry = 0;
    }
    bytes[i] = v % 256;
  }
}

export function applyTwosComplement(bytes: Uint8Array, negative: boolean) {
  if (bytes[bytes.length - 1] >= 128) {
    bytes[bytes.length - 1] -= 128;
  }
  if (negative) {
    flipBits(bytes);
    addOne(bytes);
  }
}

export function removeTwosComplement(bytes: Uint8Array) {
  const negative = bytes[bytes.length - 1] >= 128;
  if (negative) {
    flipBits(bytes);
    addOne(bytes);
  }
  return negative;
}

const hexEncodeArray = Array.from(Array(16), (_, idx) => idx.toString(16));

export function bytesToHex(bytes: Uint8Array) {
  let s = "";
  for (let i = bytes.length - 1; i >= 0; i--) {
    const byte = bytes[i];
    s += hexEncodeArray[Math.floor(byte / 16)];
    s += hexEncodeArray[byte % 16];
  }
  return s;
}

const hexDecodeObject = {} as { [index: string]: number };
hexEncodeArray.forEach((s, idx) => (hexDecodeObject[s] = idx));

export function hexToBytes(s: string) {
  if (s.length % 2) s = "0" + s;
  const bytes = new Uint8Array(s.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const upper = hexDecodeObject[s[2 * i]] * 16;
    const lower = hexDecodeObject[s[2 * i + 1]];
    bytes[bytes.length - i - 1] = upper + lower;
  }
  return bytes;
}

export function resizeBytes(bytes: Uint8Array, length: number) {
  if (bytes.length === length) return bytes;
  if (bytes.length > length) return bytes.subarray(0, length);
  return new Uint8Array([...bytes, ...Array(length - bytes.length).fill(0)]);
}
