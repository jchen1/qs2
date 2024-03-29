# Add rules here to build your software
# See https://docs.bazel.build/versions/master/build-ref.html#BUILD_files

# Allow any ts_library rules in this workspace to reference the config
# Note: if you move the tsconfig.json file to a subdirectory, you can add an alias() here instead
#   so that ts_library rules still use it by default.
#   See https://www.npmjs.com/package/@bazel/typescript#installation
package(default_visibility=["//visibility:public"])

load("@build_bazel_rules_nodejs//:defs.bzl", "nodejs_binary")

exports_files(["tsconfig.json", ".graphqlrc.yml"], visibility = ["//visibility:public"])

filegroup(
  name = "node_modules",
  srcs = glob(
    [
      "node_modules/**/*.js",
      "node_modules/**/*.d.ts",
      "node_modules/**/*.json",
      "node_modules/.bin/*",
    ],
    exclude = [
      # Files under test & docs may contain file names that
      # are not legal Bazel labels (e.g.,
      # node_modules/ecstatic/test/public/中文/檔案.html)
      "node_modules/**/test/**",
      "node_modules/**/docs/**",
      # Files with spaces in the name are not legal Bazel labels
      "node_modules/**/* */**",
      "node_modules/**/* *",
    ],
  ),
)

# Create a tsc_wrapped compiler rule to use in the ts_library
# compiler attribute when using self-managed dependencies
nodejs_binary(
  name = "tsc_wrapped",
  entry_point = "@npm//:node_modules/@bazel/typescript/internal/tsc_wrapped/tsc_wrapped.js",
  # Point bazel to your node_modules to find the entry point
  node_modules = "@npm//:node_modules",
  data = [
    "@npm//protobufjs",
    "@npm//source-map-support",
    "@npm//tsutils",
    "@npm//typescript",
    "@npm//@bazel/typescript",
  ],
)

nodejs_binary(
  name = "prettier_bin",
  entry_point = "@npm//:node_modules/prettier/bin-prettier.js",
  node_modules = "@npm//:node_modules",
  data = [
    "@npm//:node_modules",
  ],
)

genrule(
  name = "prettier",
  srcs = glob(["src/ts/*.ts", "src/ts/**/*.ts"]),
  tools = [":prettier_bin"],
  outs = ["prettier.tgz"],
  cmd = "$(location :prettier_bin) src/**/*.ts --write && tar -pczf archive.tar.gz src && mv archive.tar.gz $@"
)
