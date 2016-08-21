package(default_visibility = ["//:internal"])

load("@gs_tools//bazel/ts:defs.bzl", "ts_library")


ts_library(
    name = "declarations",
    srcs = glob(['*.d.ts']) + [
      "@typescript//:es6",
    ],
    deps = [
      "//declarations/angular-material:angular_material"
    ]
)
