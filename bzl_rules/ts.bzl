"""
Rules for typescript.
"""


# TODO https://github.com/bazelbuild/rules_nodejs/issues/1013
load("@npm_bazel_typescript//:index.bzl", old_ts_library = "ts_library")

def ts_library(node_modules="@npm//:node_modules", compiler="//:tsc_wrapped", **kwargs):
  """custom ts_library
  """
  old_ts_library(
    node_modules = node_modules,
    compiler = compiler,
    **kwargs
  )

# load("@npm//typescript:index.bzl", "tsc")
# def ts_library(name, srcs, deps = [], node_modules="@npm//:node_modules", **kwargs):
#   """ts_library reimplmentation
#   """

#   tsc(
#     name = name,
#     data = srcs + [node_modules] + deps,
#     outs = [s.replace(".ts", ext) for ext in [".js", ".d.ts"] for s in srcs],
#     args = [
#       "--outDir",
#       "$@",
#       "--lib",
#       "es2017,dom",
#       "--downlevelIteration",
#       "--declaration",
#       "--noImplicitAny",
#       "--preserveConstEnums",
#       "--strict",
#       "--target", "es2017",
#       "--module", "commonjs",
#       "--moduleResolution", "node",
#       "--allowSyntheticDefaultImports",
#       "--importHelpers",
#       "--sourceMap",
#       "--esModuleInterop",
#       # "--listFiles"
#     ] + [
#       "$(location %s)" % s for s in srcs
#     ],
#     **kwargs
#   )
