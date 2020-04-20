import { unroll } from "../unroll";

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
