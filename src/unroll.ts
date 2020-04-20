function looseParseInt(s: string) {
  try {
    let n = Number.parseInt(`${Function(`"use strict";return (${s})`)()}`, 10);
    if (Number.isNaN(n)) return null;
    return n;
  } catch {
    return null;
  }
}
function removeOuterMostParens(s: string) {
  s = s
    .split("(")
    .slice(1)
    .join("(");
  s = s
    .split(")")
    .slice(0, -1)
    .join(")");
  return s.trim();
}

function getLoopVariableFromHeader(s: string) {
  s = s
    .split("int")
    .slice(1)
    .join("int");
  s = s.trim().split("=")[0];
  return s.trim();
}

function getLoopStartIndexFromHeader(s: string) {
  s = s
    .split("=")
    .slice(1)
    .join("=");
  s = s.trim().split(";")[0];
  const n = looseParseInt(s);
  if (n === null) throw new Error(`'#pragma unroll' was unable to parse starting index from '${s}'`);
  return n;
}

function getLoopStopIndexFromHeader(s: string) {
  s = "".concat(...s.split(";").slice(1, 2)).trim();
  if (s.includes("<")) {
    let n = looseParseInt("".concat(...s.split("<").slice(1)).trim());
    if (n !== null) return n;
  }
  if (s.includes(">=")) {
    let n = looseParseInt("".concat(...s.split(">=").slice(1)).trim());
    if (n !== null) return n - 1;
  }
  throw new Error(`'#pragma unroll' was unable to parse stop index from '${s}'`);
}

function getMutationDirectionFromHeader(s: string) {
  s = s
    .split(";")
    .slice(2)
    .join(";");
  if (s.endsWith("++")) return 1;
  if (s.endsWith("--")) return -1;
  throw new Error(`'#pragma unroll' encountered an invalid mutator: '${s}'`);
}

function removeForLoopHeader(s: string) {
  s = s
    .split("(")
    .slice(1)
    .join("(");
  let parens = 1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") parens++;
    if (s[i] === ")") parens--;
    if (parens === 0) return s.slice(i + 1).trimLeft();
  }
  return s;
}

function startsWithOpenSquiglyBracket(s: string) {
  for (let c of s) {
    if (c === " ") continue;
    if (c === "\t") continue;
    if (c === "\n") continue;
    if (c === "{") return true;
    break;
  }
  return false;
}

function getClosingBracketIndexFromBody(s: string) {
  let squigly = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === "{") squigly++;
    if (s[i] === "}") squigly--;
    if (squigly === 0) return i;
  }
  throw new Error(`'#pragma unroll' could not find closing bracket for body: '${s}'`);
}

export function unroll(s: string) {
  let output = "";
  const sections = s.split("#pragma unroll\n");
  for (let section of sections.slice(1).reverse()) {
    const firstLine = section.split("\n")[0];
    const forLoopHeader = removeOuterMostParens(firstLine);
    const loopVariable = getLoopVariableFromHeader(forLoopHeader);
    const startIndex = getLoopStartIndexFromHeader(forLoopHeader);
    const stopIndex = getLoopStopIndexFromHeader(forLoopHeader);
    const mutationValue = getMutationDirectionFromHeader(forLoopHeader);
    let body = removeForLoopHeader(section);
    let bodyEndIndex = 0;
    const hasSquigly = startsWithOpenSquiglyBracket(body);
    if (hasSquigly) {
      body = body.slice(body.search("{") + 1);
      bodyEndIndex = getClosingBracketIndexFromBody(body) - 1;
    } else {
      bodyEndIndex = body.search(";");
    }
    const postBody = body.slice(bodyEndIndex + 1);
    body = body.slice(0, bodyEndIndex + 1);
    let unrolledBody = "{";
    for (let i = startIndex; i > stopIndex; i += mutationValue) {
      unrolledBody +=
        "{" +
        (hasSquigly ? body : `\n\t${body}\n`).replace(/[a-zA-Z][a-zA-Z0-9_]*/g, varName =>
          varName === loopVariable ? `${i}` : varName
        ) +
        "}";
    }
    unrolledBody += hasSquigly ? "" : "}";
    output = unrolledBody + postBody + output;
  }
  return sections[0] + output;
}
