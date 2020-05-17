export interface Definitions {
  [index: string]: string;
}

export interface Declarations {
  [index: string]: {
    prepend: string;
    declarations: string[];
    append: string;
  };
}

function findDependencies(s: string, decs: Declarations, defs: Definitions) {
  let i = 0;
  const deps = [] as string[];
  const recurse = (pn: string | null, ps: string) => {
    for (let [cn, x] of Object.entries(decs)) {
      for (let dec of x.declarations) {
        if (ps.includes(dec)) {
          if (i++ > 1e6) throw new Error(`dependency loop: ${pn} ${cn}`);
          recurse(cn, defs[cn]);
        }
      }
    }
    if (pn && !deps.includes(pn)) {
      deps.push(pn);
    }
  };
  recurse(null, s);
  return deps;
}

function removeDependencies(s: string, decs: Declarations) {
  for (let x of Object.values(decs)) {
    for (let dec of x.declarations) {
      while (s.includes(dec)) {
        s = s.replace(dec, "");
      }
    }
  }
  return s;
}

function prependDependencies(s: string, deps: string[], decs: Declarations, defs: Definitions) {
  let output = "";
  for (let key of deps) {
    output += decs[key].prepend + "\n\n";
    output += removeDependencies(defs[key], decs) + "\n\n";
    output += decs[key].append + "\n\n";
  }
  return output + s;
}

function removeStutters(s: string, stutters: string[]) {
  for (let stutter of stutters) {
    const cursor = s.search(stutter);
    const a = s.substring(0, cursor + stutter.length);
    let b = s.substring(cursor);
    while (b.includes(stutter)) b = b.replace(stutter, "");
    return a + b;
  }
  return s;
}

export function expandDefinitions(definitions: Definitions, declarations: Declarations, stutters?: string[]) {
  const output = {} as Definitions;
  for (let key of Object.keys(definitions)) {
    const dependencies = findDependencies(definitions[key], declarations, definitions);
    output[key] = prependDependencies(definitions[key], dependencies, declarations, definitions);
    output[key] = removeDependencies(output[key], declarations);
    if (stutters) output[key] = removeStutters(output[key], stutters);
    output[key] = `${declarations[key].prepend}\n\n${output[key]}`;
    output[key] = `${output[key]}\n\n${declarations[key].append}`;
    output[key] = output[key].replace(/\n{3,}/g, "\n\n");
  }
  return output;
}
