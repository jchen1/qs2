package(default_visibility=["//visibility:public"])
load("//bzl_rules:ts.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

ts_library(
  name = "ts_auto_deps_lib",
  srcs = ["auto_deps.ts"]
)

nodejs_binary(
  name = "ts_auto_deps",
  entry_point = ":auto_deps.ts",
  data = [":ts_auto_deps_lib", "@npm//typescript", "@npm//@types/typescript"]
)
