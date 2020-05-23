export interface Rendered {
  [key: string]: string;
}

export interface Dependencies {
  [name: string]: {
    source: string;
    signatures: Signature[];
  };
}

export interface Signature {
  returns: string;
  parameters: Parameter[];
}

export interface Parameter {
  type: string;
  qualifier?: "in" | "out" | "inout";
  arrayLength?: number | string;
}

function getRegexFromSignature(name: string, sig: Signature) {
  let s = `^[ \t]*${sig.returns}[ \t]+${name}\\(`;
  for (let param of sig.parameters) {
    const qualifier = param.qualifier ? param.qualifier : "in";
    s += `[ \t]*${qualifier === "in" ? "(?:in)?" : qualifier}`;
    s += `[ \t]*${param.type}[ \t]*\w*`;
    s += param.arrayLength ? `\\[${param.arrayLength}\\]` : "";
    s += `[ \t]*,`;
  }
  return new RegExp(`${s.slice(0, -1)}\\);`, "gm");
}

function findDependencies(source: string, dependencies: Dependencies) {
  let i = 0;
  const matches = [] as string[];
  const recurse = (pn: string | null, ps: string) => {
    for (let [cn, x] of Object.entries(dependencies)) {
      for (let sig of x.signatures) {
        if (ps.match(getRegexFromSignature(cn, sig))) {
          if (i++ > 1e6) throw new Error(`dependency loop: ${pn} ${cn}`);
          recurse(cn, x.source);
        }
      }
    }
    if (pn && !matches.includes(pn)) {
      matches.push(pn);
    }
  };
  recurse(null, source);
  return matches;
}

function removeDependencies(s: string, dependencies: Dependencies) {
  for (let [name, x] of Object.entries(dependencies)) {
    for (let sig of x.signatures) {
      const rgx = getRegexFromSignature(name, sig);
      s = s.replace(rgx, "");
    }
  }
  return s;
}

export function camelToSnake(s: string) {
  return s.replace(/[\w]([A-Z])/g, m => `${m[0]}_${m[1]}`).toLowerCase();
}

function addPreprocessor(source: string, name: string) {
  const ppname = camelToSnake(name).toUpperCase();
  return `#ifndef ${ppname}\n#define ${ppname}\n\n${source}\n\n#endif\n`;
}

function prependDependencies(s: string, deps: string[], allDeps: Dependencies) {
  let output = "";
  for (let name of deps) {
    const sanitized = removeDependencies(allDeps[name].source, allDeps);
    output += addPreprocessor(sanitized, name) + "\n";
  }
  return output + s;
}

function escapedRegExp(s: string) {
  return new RegExp(s.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"), "gm");
}

function removeStuttering(s: string, stutters: (RegExp | string)[]) {
  for (let stutter of stutters) {
    let i = 0;
    if (typeof stutter === "string") stutter = escapedRegExp(stutter);
    s = s.replace(stutter, m => (i++ === 0 ? m : ""));
  }
  return s;
}

function deepcopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function sanitizeDependencies(dependencies: Dependencies) {
  const output = deepcopy(dependencies) as Dependencies;
  for (let v of Object.values(output)) {
    v.source = v.source
      .replace(/\r+/gm, "")
      .replace(/\t/g, "    ")
      .replace(/\n{3,}/g, "\n\n");
  }
  return output;
}

export function render(dependencies: Dependencies, stutters?: RegExp[]) {
  const output = {} as Rendered;
  dependencies = sanitizeDependencies(dependencies);
  for (let [name, x] of Object.entries(dependencies)) {
    const found = findDependencies(x.source, dependencies);
    output[name] = removeDependencies(x.source, dependencies);
    output[name] = removeStuttering(output[name], stutters ? stutters : []);
    output[name] = addPreprocessor(output[name], name);
    output[name] = prependDependencies(output[name], found, dependencies);
    output[name] = output[name].replace(/\n{3,}/g, "\n\n");
  }
  return output;
}

export function merge(...arr: Dependencies[]) {
  const output = {} as Dependencies;
  for (let x of arr) Object.assign(output, x);
  return output;
}

export function replace(s: string, dependencies: Dependencies, stutters?: RegExp[]) {
  stutters = stutters ? stutters : [];
  dependencies = sanitizeDependencies(dependencies);
  const rendered = render(dependencies, stutters);
  for (let [name, x] of Object.entries(dependencies)) {
    for (let sig of x.signatures) {
      const rgx = getRegexFromSignature(name, sig);
      s = s.replace(rgx, rendered[name]);
    }
  }
  return removeStuttering(s, [...Object.values(rendered), ...stutters]).replace(/\n{3,}/g, "\n\n");
}

function decToSig(s: string) {
  const signature = {
    returns: s.split(/\s+/gm)[0],
    parameters: []
  } as Signature;
  s = s.split("(")[1].split(")")[0];
  for (let pstring of s.split(/,\s+/gm)) {
    const parameter = {} as Parameter;
    const words = pstring.split(/\s+/gm);
    if (["in", "out", "inout"].includes(words[0])) {
      parameter.qualifier = words[0] as "in" | "out" | "inout";
      words.shift();
    }
    parameter.type = words[0];
    if (!parameter.type) throw new Error("unable to determine parameter type");
    words.shift();
    if (words[0] && words[0].startsWith("[") && words[0].endsWith("]")) {
      const expr = words[0].slice(1).slice(0, -1);
      parameter.arrayLength = Number(expr) ? Number(expr) : expr;
    }
    signature.parameters.push(parameter);
  }
  if (!signature.returns) throw new Error("unable to parse return type");
  return signature;
}

export function getDependencies(objects: { [key: string]: { source: string; declarations: string[] } }) {
  const dependencies = {} as Dependencies;
  for (let [k, v] of Object.entries(objects)) {
    dependencies[k] = {
      source: v.source,
      signatures: Array.from(v.declarations, dec => decToSig(dec))
    };
  }
  return sanitizeDependencies(dependencies);
}
