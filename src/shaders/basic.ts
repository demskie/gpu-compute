import { commonStutters } from "../functionStrings";
import { getDependencies, render } from "../dependencies";

// prettier-ignore
export const dependencies = getDependencies({
  eq: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/eq.glsl"), "utf8"),
    declarations: [
      "float eq(float, float);"
    ],
  },
  gt: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/gt.glsl"), "utf8"),
    declarations: [
      "float gt(float, float);"
    ],
  },
  gte: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/gte.glsl"), "utf8"),
    declarations: [
      "float gte(float, float);"
    ],
  },
  int16FromVec2: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/int16FromVec2.glsl"), "utf8"),
    declarations: [
      "float int16FromVec2(vec2);"
    ],
  },
  int16ToVec2: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/int16ToVec2.glsl"), "utf8"),
    declarations: [
      "vec2 int16ToVec2(float);"
    ],
  },
  lt: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/lt.glsl"), "utf8"),
    declarations: [
      "float lt(float, float);"
    ],
  },
  lte: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/lte.glsl"), "utf8"),
    declarations: [
      "float lte(float, float);"
    ],
  },
  neq: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/neq.glsl"), "utf8"),
    declarations: [
      "float neq(float, float);"
    ],
  },
  packBooleans: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/packBooleans.glsl"), "utf8"),
    declarations: [
      "float packBooleans(bool [8]);"
    ],
  },
  round: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/round.glsl"), "utf8"),
    declarations: [
      "float round(float);"
    ],
  },
  uint16FromVec2: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/uint16FromVec2.glsl"), "utf8"),
    declarations: [
      "float uint16FromVec2(vec2);"
    ],
  },
  uint16ToVec2: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/uint16ToVec2.glsl"), "utf8"),
    declarations: [
      "vec2 uint16ToVec2(float);"
    ],
  },
  unpackBooleans: {
    source: require("fs").readFileSync(require.resolve("../../src/shaders/basic/unpackBooleans.glsl"), "utf8"),
    declarations: [
      "void unpackBooleans(float, inout bool [8]);"
    ],
  }
});

export const rendered = render(dependencies, commonStutters);
