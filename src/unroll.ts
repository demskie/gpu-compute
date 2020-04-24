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
  return s
    .split("int")
    .slice(1)
    .join("int")
    .trim()
    .split("=")[0]
    .trim();
}

function getLoopStartIndexFromHeader(s: string) {
  s = s
    .split("=")
    .slice(1)
    .join("=")
    .trim()
    .split(";")[0];
  const n = looseParseInt(s);
  if (n === null) throw new Error(`'#pragma unroll' was unable to parse starting index from '${s}'`);
  return n;
}

function getLoopStopIndexFromHeader(s: string) {
  s = s.replace(/^[^;]*;/g, "");
  s = s.replace(/;[^;]*$/gm, "");
  if (s.includes("<")) {
    let n = looseParseInt("".concat(...s.split("<").slice(1)));
    if (n !== null) return n;
  } else if (s.includes(">=")) {
    let n = looseParseInt("".concat(...s.split(">=").slice(1)));
    if (n !== null) return n - 1;
  } else if (s.includes(">")) {
    let n = looseParseInt("".concat(...s.split(">").slice(1)));
    if (n !== null) return n;
  }
  throw new Error(`'#pragma unroll' was unable to parse stop index from '${s}'`);
}

function getMutationDirectionFromHeader(s: string) {
  s = s.replace(/^[^;]*;[^;]*;/g, "");
  s = s.replace(/\)[^\)]*$/gm, "");
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
  return null;
}

function enforceForLoopRestrictions(s: string) {
  s.replace(/[a-zA-Z][a-zA-Z0-9_]*/g, varName => {
    if (varName === "continue" || varName === "break")
      throw new Error(`'#pragma unroll' cannot handle the following body: '${s}'`);
    return varName;
  });
}

function replaceLoopVariable(body: string, loopVariable: string, index: number) {
  return body.replace(/[a-zA-Z][a-zA-Z0-9_]*/g, varName => {
    return varName === loopVariable ? `${index}` : varName;
  });
}

export function unroll(s: string, unscoped?: boolean) {
  let sections = [];
  if (!unscoped) {
    sections = s.split("#pragma unroll\n");
  } else {
    sections = s.split("#pragma unroll_unscoped\n");
  }
  for (let i = sections.length - 1; i > 0; i--) {
    const section = sections[i];
    const firstLine = section.split("\n")[0];
    const forLoopHeader = removeOuterMostParens(firstLine);
    const loopVariable = getLoopVariableFromHeader(forLoopHeader);
    const startIndex = getLoopStartIndexFromHeader(forLoopHeader);
    const stopIndex = getLoopStopIndexFromHeader(forLoopHeader);
    const mutationValue = getMutationDirectionFromHeader(forLoopHeader);
    if (mutationValue > 0 && startIndex > stopIndex)
      throw new Error(`#pragma unroll found start:${startIndex} > stop:${stopIndex}`);
    if (mutationValue < 0 && startIndex < stopIndex)
      throw new Error(`#pragma unroll found start:${startIndex} < stop:${stopIndex}`);
    let unparsed = removeForLoopHeader(section);
    let bodyEndIndex = 0;
    let postBodyStartIndex = 0;
    const hasSquigly = startsWithOpenSquiglyBracket(unparsed);
    if (hasSquigly) {
      unparsed = unparsed.slice(unparsed.search("{") + 1);
      let bracketIndex = getClosingBracketIndexFromBody(unparsed);
      if (bracketIndex === null) {
        for (let j = i + 1; j < sections.length; j++) {
          unparsed += sections[j];
          bracketIndex = getClosingBracketIndexFromBody(unparsed);
          sections[j] = "";
          if (bracketIndex !== null) break;
        }
        if (bracketIndex === null)
          throw new Error(`'#pragma unroll' could not find closing bracket for body: '${unparsed}'`);
      }
      bodyEndIndex = bracketIndex;
      postBodyStartIndex = bodyEndIndex + 1;
    } else {
      bodyEndIndex = unparsed.search(";");
      postBodyStartIndex = bodyEndIndex + 1;
    }
    let body = unparsed.slice(0, bodyEndIndex);
    const postBody = unparsed.slice(postBodyStartIndex);
    // console.error({ body, postBody });
    let whitespace = "";
    if (!hasSquigly) {
      const match = firstLine.match(/^\s*/gm);
      if (match) whitespace = match[0];
      if (!unscoped) {
        body = `\n\t${whitespace}${body}\n`;
      } else {
        body = `${whitespace}${body}\n`;
      }
    }
    enforceForLoopRestrictions(body);
    let unrolledBody = "";
    if (mutationValue > 0) {
      for (let j = startIndex; j < stopIndex; j += mutationValue) {
        unrolledBody += unscoped ? "" : "{";
        unrolledBody += replaceLoopVariable(body, loopVariable, j);
        unrolledBody += unscoped ? "" : `${whitespace}}`;
      }
    } else if (mutationValue < 0) {
      for (let j = startIndex; j > stopIndex; j += mutationValue) {
        unrolledBody += unscoped ? "" : "{";
        unrolledBody += replaceLoopVariable(body, loopVariable, j);
        unrolledBody += unscoped ? "" : `${whitespace}}`;
      }
    }
    sections[i] = unrolledBody + postBody;
  }
  s = sections.join("");
  s = s.replace(/\t/g, "    ");
  return s.trim();
}
