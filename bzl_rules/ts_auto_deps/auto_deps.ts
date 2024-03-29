import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import assert from 'assert';

// ------------------ UTIL ------------------

function walk(directory: string, onFile: (_: string) => void) {
  fs.readdirSync(directory).forEach(f => {
    const dirPath = path.join(directory, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walk(dirPath, onFile);
    } else {
      onFile(dirPath);
    }
  });
}

function allFiles(directory: string) {
  const files: string[] = [];
  walk(directory, f => files.push(f));

  return files;
}

function isDirPackage(p: string) {
  return fs.existsSync(p) &&
    fs.statSync(p).isDirectory() &&
    fs.existsSync(`${p}/index.ts`) &&
    fs.statSync(`${p}/index.ts`).isFile();
}

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
  return imports.sort();
}

// ------------------ BAZEL RULES ------------------

function importToBazelDeps(workspace: string, fileName: string, imp: string): string {
  const importWithoutRelativePath = path.normalize(imp);
  const actualLib = path.basename(importWithoutRelativePath);

  let fullImport = path.join(path.dirname(fileName), imp);
  if (!isDirPackage(path.join(workspace, fullImport))) {
    fullImport = path.dirname(fullImport);
  }

  return `//${fullImport}:${actualLib}_lib`;
}

function tsLibrary(fileName: string, deps: string[]) {
  const srcName = `${fileName.split("/").reverse()[0]}`;
  const libName = srcName === "index.ts" ? `${fileName.split("/").reverse()[1]}` : srcName;
  const ruleName = `${libName.replace(/\.ts$/gi, "")}_lib`;
  const depsString = (deps.length > 0 ?
    `[
${deps.map(d => `    "${d}",`).join("\n")}
  ]`
    : '[]');

  const libString =
`ts_library(
  name = "${ruleName}",
  srcs = ["${srcName}"],
  deps = ${depsString},
  tags = ["autogenerated"],
  visibility = ["//visibility:public"],
)`;

  return { ruleName, libString };
}

function modifyBuildPrefix(build: string): string {
  if (build.length === 0) {
    return `package(default_visibility=["//visibility:public"])
load("//bzl_rules:ts.bzl", "ts_library")`;
  }
  const lines = build.split("\n");

  assert(lines[0] === `package(default_visibility=["//visibility:public"])`, `auto_deps managed files must start with package(default_visibility=["//visibility:public"])`);
  assert(lines[1] === `load("//bzl_rules:ts.bzl", "ts_library")`, `auto_deps managed files must call load("//bzl_rules:ts.bzl", "ts_library") in line 2`);

  return build;
}

function positionInBuild(build: string, ruleName: string) {
  const libRegex = new RegExp(`ts_library\\(\\n\\s+name = "${ruleName}",`, 'mgi');
  const start = build.search(libRegex);
  const end = start + build.slice(start).indexOf(")");

  const existingLibString = build.slice(start, end);
  assert(existingLibString.search(/tags = \[.*"autogenerated".*\]/) !== -1, `auto_deps rule ${ruleName} conflicts with existing rule!`);

  return { start, end };
}

function modifyBuildRule(build: string, ruleName: string, libString: string) {
  const { start, end } = positionInBuild(build, ruleName);

  if (!start && !end) {
    return `${build}

${libString}`;
  }

  const prefix = build.slice(0, start);
  const suffix = build.slice(end + 1);

  return `${prefix}
${libString}${suffix}`;
}

function generateBuildFile(build: string, libraries: { ruleName: string, libString: string }[]): string {
  const prefixedBuild = modifyBuildPrefix(build);

  const buildWithLibs = libraries.reduce(
    (build, { ruleName, libString }) => modifyBuildRule(build, ruleName, libString),
    prefixedBuild)
    .replace(/\n\n\n/g, "\n\n");

  if (!buildWithLibs.endsWith("\n")) {
    return buildWithLibs.concat("\n");
  }

  return buildWithLibs;
}

// ------------------ PUBLIC API ------------------

export function bazelRuleFromTypescript(workspace: string, fileName: string, path: string, program: ts.Program, checker: ts.TypeChecker) {
  const source = program.getSourceFile(path)!;
  const imports = getImports(source, checker);
  const rules = imports.map(i => importToBazelDeps(workspace, fileName, i));
  return tsLibrary(fileName, rules);
}

export function autoDeps() {
  const workspace = process.env.BUILD_WORKSPACE_DIRECTORY || process.env.PWD || "";

  const srcdir = path.join(workspace, process.argv[2]);
  const files = allFiles(srcdir).map(f => ({ absolutePath: f, fileName: path.relative(workspace, f)}));

  const tsFiles = files.filter(f => f.absolutePath.endsWith(".ts"));

  // TODO support BUILD.bazel files
  const buildFiles: { [key: string]: { content: string, rules: any[] } } = files
    .filter(f => f.absolutePath.endsWith("BUILD"))
    .reduce((accum: { [key: string]: { content: string, rules: any[] } }, f) => {
      accum[f.absolutePath] = { content: fs.readFileSync(f.absolutePath).toString(), rules: [] };
      return accum;
    }, {});

  const program = ts.createProgram(tsFiles.map(f => f.absolutePath), {}); // todo es2017, ???
  const checker = program.getTypeChecker();

  tsFiles.forEach(({fileName, absolutePath}) => {
    const bazelRule = bazelRuleFromTypescript(workspace, fileName, absolutePath, program, checker);
    const buildFilePath = path.join(path.dirname(absolutePath), "BUILD");
    if (!buildFiles[buildFilePath]) {
      buildFiles[buildFilePath] = { content: "", rules: [] };
    }
    buildFiles[buildFilePath].rules.push(bazelRule);
  });

  for (const [buildFilePath, {content, rules}] of Object.entries(buildFiles)) {
    const buildFile = generateBuildFile(content, rules);
    if (buildFile !== content) {
      fs.writeFileSync(buildFilePath, buildFile);
    }
  }
}

autoDeps();
