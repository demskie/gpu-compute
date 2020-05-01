import * as gpu from "../index";
import { readFileSync } from "fs";
import { declarationToDefinition, uint64ToBytes, bytesToUint64 } from "../shaders/biguint/biguint";

let shaders = {} as { [index: string]: gpu.ComputeShader };

beforeAll(() => {
  gpu.setWebGLContext(require("gl")(1, 1));
  for (let kind of [
    "Add",
    "And",
    "Div",
    "Lshift",
    "LshiftByOne",
    "Mod",
    "Mul",
    "Or",
    "Pow",
    "Rshift",
    "Sqrt",
    "Sub",
    "Xor"
  ]) {
    let s = readFileSync(require.resolve(`./shaders/biguintTest${kind}.frag`), "utf8");
    for (let [key, val] of Object.entries(declarationToDefinition)) s = s.replace(key, val);
    s = s.replace(/\r+/gm, "");
    s = s.replace(/#ifndef BYTE_COUNT\s*#define BYTE_COUNT 16\s*#endif/g, "");
    s = s.replace(/#define BYTE_COUNT 16/g, "");
    s = s.replace(/BYTE_COUNT/g, `${16}`);
    const t = Date.now();
    const computeShader = new gpu.ComputeShader(s);
    console.debug(`${kind} compile time: ${Date.now() - t}ms`);
    shaders[kind] = computeShader;
  }
});

test("golden test", () => {
  const rta = new gpu.RenderTarget(2);
  const rtb = new gpu.RenderTarget(2);
  const rtc = new gpu.RenderTarget(2);
  const check = (kind: string, a: number, b: number, c: number) => {
    rta.pushTextureData(uint64ToBytes(a));
    rtb.pushTextureData(uint64ToBytes(b));
    const actual = rtc
      .compute(shaders[kind], {
        u_tex1: rta,
        u_tex2: rtb
      })
      .readPixels();
    console.debug(`rta: ${rta.readPixels()}`);
    console.debug(`rtb: ${rtb.readPixels()}`);
    console.debug(`rtc: ${rtc.readPixels()}`);
    const expected = uint64ToBytes(c);
    if (`${actual}` !== `${expected}`) {
      throw new Error(`${a} ${kind.toLowerCase()} ${b} != ${bytesToUint64(actual)}`);
    }
  };
  check("Add", 80, 20, 100);
  check("Add", 18, 22, 40);
  check("Add", 80, 20, 100);
  check("Add", 100080, 20, 100100);
  check("Add", 18, 559022, 559040);
  check("Add", 2000000000, 2000000000, 4000000000);
  check("Add", 65535, 1, 65536);
  check("Add", 16776960, 256, 16777216);
  check("Sub", 1000001, 1000000, 1);
  check("Sub", 42, 0, 42);
  check("Sub", 101, 100, 1);
  check("Sub", 242, 42, 200);
  check("Sub", 1042, 0, 1042);
  check("Sub", 101010101, 101010100, 1);
  check("Sub", 65536, 1, 65535);
  check("Sub", 16057794, 1048544, 15009250);
  check("Sub", 10449754, 6684597, 3765157);
  check("Sub", 13596688, 327476, 13269212);
  check("Sub", 12305759, 5177206, 7128553);
  check("Sub", 1048576, 1, 1048575);
  check("Sub", 65536, 1, 65535);
  check("Sub", 11910836, 131012, 11779824);
  check("Sub", 7370325, 5308328, 2061997);
  check("Sub", 15772048, 1900497, 13871551);
  check("Mul", 42, 0, 0);
  check("Mul", 42, 1, 42);
  check("Mul", 42, 2, 84);
  check("Mul", 42, 10, 420);
  check("Mul", 42, 100, 4200);
  check("Mul", 420, 1000, 420000);
  check("Mul", 200, 8, 1600);
  check("Mul", 2, 256, 512);
  check("Mul", 500, 2, 1000);
  check("Mul", 500000, 2, 1000000);
  check("Mul", 500, 500, 250000);
  check("Mul", 1000000000, 2, 2000000000);
  check("Mul", 2, 1000000000, 2000000000);
  check("Mul", 1000000000, 4, 4000000000);
  check("Div", 4294967295, 4294967295, 1);
  check("Div", 4294967295, 65536, 65535);
  check("Div", 4294967295, 4096, 1048575);
  check("Div", 4294967295, 256, 16777215);
  check("Div", 1000000, 1000, 1000);
  check("Div", 1000000, 10000, 100);
  check("Div", 1000000, 100000, 10);
  check("Div", 1000000, 1000000, 1);
  check("Div", 1000000, 10000000, 0);
  check("Div", 28, 7, 4);
  check("Div", 27, 7, 3);
  check("Div", 26, 7, 3);
  check("Div", 25, 7, 3);
  check("Div", 24, 7, 3);
  check("Div", 23, 7, 3);
  check("Div", 22, 7, 3);
  check("Div", 21, 7, 3);
  check("Div", 20, 7, 2);
  check("Div", 0, 12, 0);
  check("Div", 10, 1, 10);
  check("Div", 4294967295, 1, 4294967295);
  check("Div", 4294967295, 65536, 65535);
  check("Div", 11757095, 917397, 12);
  check("Div", 15049102, 655234, 22);
  check("Div", 4582864, 327450, 13);
  check("Mod", 8, 3, 2);
  check("Mod", 1024, 1000, 24);
  check("Mod", 16777215, 1234, 985);
  check("Mod", 4294967295, 239, 109);
  check("Mod", 12345678, 16384, 8526);
  check("Mod", 15180612, 7471080, 238452);
  check("Mod", 10725793, 196420, 119113);
  check("Mod", 12658866, 6356833, 6302033);
  check("Mod", 14426708, 5341162, 0x392280);
  check("Mod", 7773337, 2949082, 1875173);
  check("Mod", 12685430, 3276756, 2855162);
  check("And", 4294967295, 5570730, 5570730);
  check("And", 7, 3, 3);
  check("And", 4294967295, 0, 0);
  check("And", 0, 4294967295, 0);
  check("And", 4294967295, 4294967295, 4294967295);
  check("Or", 4294967295, 0, 4294967295);
  check("Or", 0, 4294967295, 4294967295);
  check("Or", 0, 4294967295, 4294967295);
  check("Or", 1431655765, 2863311530, 4294967295);
  check("Or", 4294967295, 4294967295, 4294967295);
  check("Or", 4, 3, 7);
  check("Xor", 7, 4, 3);
  check("Xor", 65535, 21845, 43690);
  check("Xor", 21845, 43690, 65535);
  check("Xor", 43690, 21845, 65535);
  check("Xor", 0, 65535, 65535);
  check("Xor", 21845, 65535, 43690);
  check("Xor", 43690, 65535, 21845);
  check("Pow", 2, 0, 1);
  check("Pow", 2, 1, 2);
  check("Pow", 2, 2, 4);
  check("Pow", 2, 3, 8);
  check("Pow", 2, 10, 1024);
  check("Pow", 2, 20, 1048576);
  check("Pow", 2, 30, 1073741824);
  check("Lshift", 1, 0, 1);
  check("Lshift", 1, 1, 2);
  check("Lshift", 1, 2, 4);
  check("Lshift", 1, 3, 8);
  check("Lshift", 1, 4, 16);
  check("Lshift", 1, 5, 32);
  check("Lshift", 1, 6, 64);
  check("Lshift", 1, 7, 128);
  check("Lshift", 1, 8, 256);
  check("Lshift", 1, 9, 512);
  check("Lshift", 1, 10, 1024);
  check("Lshift", 1, 11, 2048);
  check("Lshift", 1, 12, 4096);
  check("Lshift", 1, 13, 8192);
  check("Lshift", 1, 14, 16384);
  check("Lshift", 1, 15, 32768);
  check("Lshift", 1, 16, 65536);
  check("Lshift", 1, 17, 131072);
  check("Lshift", 1, 18, 262144);
  check("Lshift", 1, 19, 524288);
  check("Lshift", 1, 20, 1048576);
  check("Lshift", 221, 24, 3707764736);
  check("Lshift", 104, 2, 416);
  check("Rshift", 246, 1, 123);
  check("Rshift", 26, 1, 13);
  check("Rshift", 176, 1, 88);
  check("Rshift", 186, 1, 93);
  check("Rshift", 16, 3, 2);
  check("Rshift", 232, 4, 14);
  check("Rshift", 55, 4, 3);
  check("Rshift", 160, 7, 1);
  check("Rshift", 1, 0, 1);
  check("Rshift", 2, 1, 1);
  check("Rshift", 4, 2, 1);
  check("Rshift", 8, 3, 1);
  check("Rshift", 16, 4, 1);
  check("Rshift", 32, 5, 1);
  check("Rshift", 64, 6, 1);
  check("Rshift", 128, 7, 1);
  check("Rshift", 256, 8, 1);
  check("Rshift", 512, 9, 1);
  check("Rshift", 1024, 10, 1);
  check("Rshift", 2048, 11, 1);
  check("Rshift", 4096, 12, 1);
  check("Rshift", 8192, 13, 1);
  check("Rshift", 16384, 14, 1);
  check("Rshift", 32768, 15, 1);
  check("Rshift", 65536, 16, 1);
  check("Rshift", 131072, 17, 1);
  check("Rshift", 262144, 18, 1);
  check("Rshift", 524288, 19, 1);
  check("Rshift", 1048576, 20, 1);
  check("Sqrt", 12345678, 0, 3513);
  check("Sqrt", 512, 0, 22);
  check("Sqrt", 1, 0, 1);
  check("Mul", 1, 2, 2);
  check("Mul", 12345, 123, 1518435);
  check("Mul", 12345, 256, 3160320);
  check("Mul", 12345, 512, 6320640);
  check("Mul", 12345, 1024, 12641280);
  check("Mul", 12345, 2048, 25282560);
  check("Mul", 12345, 4096, 50565120);
  check("Mul", 12345, 8192, 101130240);
  check("Mul", 12345, 16384, 202260480);
  check("Mul", 12345, 32768, 404520960);
  check("Mul", 12345, 65536, 809041920);
  check("Mul", 12345, 131072, 1618083840);
  check("Mul", 12345, 262144, 3236167680);
  check("Mul", 12345, 524288, 6472335360);
  check("Mul", 12345, 1048576, 12944670720);
  check("Div", 123456789, 123, 1003713);
  check("Div", 123456789, 256, 482253);
  check("Div", 123456789, 512, 241126);
  check("Div", 123456789, 1024, 120563);
  check("Div", 123456789, 2048, 60281);
  check("Div", 123456789, 4096, 30140);
  check("Div", 123456789, 8192, 15070);
  check("Div", 123456789, 16384, 7535);
});
