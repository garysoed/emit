package(default_visibility = ["//:internal"])

load("//:defs.bzl", "em")
load("@gs_tools//bazel/ts:defs.bzl", "ts_binary", "ts_library")

em(
    deps = [
      "@gs_tools//src",
      "@gs_tools//src/ng",
      "//web/about",
      "//web/model",
      "//web/navigate",
      "//web/schedule",
    ])
