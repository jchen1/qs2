import ts from 'typescript';

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

export function getImports(sourceFile: ts.SourceFile, checker: ts.TypeChecker): string[] {
  const imports: string[] = [];
  getImportsForNode(sourceFile, checker, imports);
  return imports;
}

const files = process.argv.slice(2);
const program = ts.createProgram(files, {}); // todo es2017, ???
const checker = program.getTypeChecker();
const importsByFile: { [key:string]: string[] } = {};

files.forEach(f => {
  const source = program.getSourceFile(f)!;
  // const source = ts.createSourceFile(f, readFileSync(f).toString(), ts.ScriptTarget.ES2017, true);
  importsByFile[f] = getImports(source, checker);
});

console.log(importsByFile);
