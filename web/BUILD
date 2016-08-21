package(default_visibility = ["//:internal"])

load("//:defs.bzl", "em")
load("@gs_tools//bazel/ts:defs.bzl", "ts_binary", "ts_library")

em(
    deps = [
      "@gs_tools//src",
      "//web/main",
    ])

ts_library(
    name = "test_base",
    srcs = [
      "test-base.ts"
    ],
    deps = [
      "@gs_tools//src",
    ])