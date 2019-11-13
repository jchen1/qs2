import ts from 'typescript';

// ------------------ TYPESCRIPT PARSING ------------------

function getImportsForNode(node: ts.Node, checker: ts.TypeChecker, imports: string[]) {
  if (ts.isImportDeclaration(node)) {
    const lib = node.moduleSpecifier.getFullText().trim().replace(/(\"|\')/gi, "");

    // only do relative deps for now
    if (lib.startsWith("/") || lib.startsWith(".")) {
      imports.push(lib);
    }
  }
  ts.forEachChild(node, n => getImportsForNode(n, checker, imports));
}

function getImports(sourceFile: ts.SourceFile, checker: ts.TypeChecker): string[] {
  const imports: string[] = [];
  getImportsForNode(sourceFile, checker, imports);
  return imports;
}

// ------------------ BAZEL RULES ------------------

function importToBazelDeps(fileName: string, imp: string): string {
  // todo...
  return `//:${imp}`;
}

function tsLibrary(fileName: string, deps: string[]): string {
  const srcName = `${fileName.split("/").reverse()[0]}`;
  const depsString = deps.map(d => `    "${d}",`).join("\n");

  return `
ts_library(
  name = "${srcName.replace(/\.ts$/gi, "")}_lib",
  srcs = ["${srcName}"],
  deps = [
${depsString}
  ],
)
  `
}

// ------------------ PUBLIC API ------------------

export function autoDeps() {
  const files = process.argv.slice(2);
  const program = ts.createProgram(files, {}); // todo es2017, ???
  const checker = program.getTypeChecker();

  files.forEach(f => {
    const source = program.getSourceFile(f)!;
    const imports = getImports(source, checker);
    // const rules = imports.map(i => )
  });
}

autoDeps();
