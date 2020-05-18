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

export function findDependencies(s: string, decs: Declarations, defs: Definitions) {
  let i = 0;
  const deps = [] as string[];
  const recurse = (pn: string | null, ps: string) => {
    for (let [cn, x] of Object.entries(decs)) {
      for (let dec of x.declarations) {
        if (ps.includes(`\n${dec}`)) {
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

export function removeDependencies(s: string, decs: Declarations) {
  for (let x of Object.values(decs)) {
    for (let dec of x.declarations) {
      while (s.includes(`\n${dec}`)) {
        s = s.replace(`\n${dec}`, "\n");
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

export function removeStutters(s: string, stutters: string[]) {
  for (let stutter of stutters) {
    const cursor = s.search(stutter);
    const a = s.substring(0, cursor + stutter.length);
    let b = s.substring(cursor);
    while (b.includes(stutter)) b = b.replace(stutter, "");
    return a + b;
  }
  return s;
}

export function renderDefinitions(definitions: Definitions, declarations: Declarations, stutters?: string[]) {
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

export function replaceDefinitions(s: string, definitions: Definitions, declarations: Declarations) {
  const set = [] as string[];
  for (let [key, obj] of Object.entries(declarations)) {
    for (let dec of obj.declarations) {
      if (s.includes(`\n${dec}`)) {
        if (set.includes(key)) {
          s = s.replace(`\n${dec}`, "\n");
        } else {
          s = s.replace(`\n${dec}`, `\n\n${definitions[key]}`);
          set.push(key);
        }
      }
    }
  }
  return s;
}
