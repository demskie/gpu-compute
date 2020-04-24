import { unroll } from "../unroll";

/*
const s1 = `this_should_not_be_unrolled!
#pragma unroll
for (int i = 4 - 1; i >= 0; i--) foo[i] += 3.0;
this_should_not_be_unrolled!`;

test("s1", () => {
  console.log(unroll(s1));
});

const s2 = `this_should_not_be_unrolled!
#pragma unroll
for (int i = 4 - 1; i >= 0; i--) {
  float bar = 14.0;
  foo[i] += bar;
  foo[i] += bar;
}
this_should_not_be_unrolled!`;

test("s2", () => {
  console.log(unroll(s2));
});

const s3 = `      void biguintDiv(in float a[16], in float b[16], inout float c[16]) {
  for (int i = 0; i < 16; i++) c[i] = 0.0;
  float current[16], denom[16], t1[16], t2[16], t3[16];
  current[0] = 1.0;
  for (int i = 0; i < 16; i++) denom[i] = b[i];
  for (int i = 0; i < 16; i++) t1[i] = a[i];
  bool hasOverflowed;
  #pragma unroll
  for (int i = 0; i < 8*16; i++) {
      if (!hasOverflowed && !biguintGreaterThan(denom, a)) {
          if (denom[16-1] >= 128.0) {
              hasOverflowed = true;
          } else {
              biguintLshiftByOne(current);
              biguintLshiftByOne(denom);
          }
      }
  }
  for (int i = 0; i < 16; i++) t2[i] = current[i];
  for (int i = 0; i < 16; i++) t3[i] = denom[i];
  biguintRshiftByOne(current);
  biguintRshiftByOne(denom);
  biguintAssignIfTrue(current, t2, hasOverflowed == false);
  biguintAssignIfTrue(denom, t3, hasOverflowed == false);
}`;

test("s3", () => {
  console.log(unroll(s3));
});

*/

const s4 = `  #pragma unroll
  for (int i = 0; i < 8; i++) {
      for (int j = 16*8 - 1; j > 0; j--) bits[j] = bits[j-1];
      bits[0] = false;
  }`;

test("s4", () => {
  // console.log(unroll(s4));
});
