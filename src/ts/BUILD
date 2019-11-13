package(default_visibility=["//visibility:public"])
load("//:bzl_rules/ts.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

ts_library(
  name = "context",
  srcs = ["context.ts"],
)

ts_library(
  name = "server",
  srcs = ["server.ts"],
  deps = [
    "//src/ts/db",
    "//src/ts/resolvers",
    "//src/ts/schema",
    "//src/ts/subscriptions",
  ]
)

nodejs_binary(
  name = "server_node",
  data = [":server", "@npm//:node_modules", "//:.graphqlrc.yml"],
  entry_point = ":server.ts",
)
