package(default_visibility = ["//:internal"])

load("@gs_tools//bazel/ts:defs.bzl", "ts_binary", "ts_library")
load("@gs_tools//bazel/webpack:defs.bzl", "webpack_binary")

package_group(
    name = "internal",
    packages = ["//..."]
)

ts_library(
    name = "lib_js",
    srcs = [],
    deps = [
        "//web",
    ]
)

ts_binary(
    name = "bin_js",
    deps = [":lib_js"],
)
webpack_binary(
    name = "pack_js",
    package = ":bin_js",
    entry = "web/app.js",
)

filegroup(
    name = "tslint_config",
    srcs = ["tslint.json"]
)

test_suite(
    name = "test",
    tests = [
        "//web/about:test",
        "//web/main:test",
        "//web/model:test",
        "//web/navigate:test",
        "//web/schedule:test",
    ]
)

filegroup(
    name = "pack_template",
    srcs = [
    ]
)

genrule(
    name = "pack",
    srcs = [
        "//:pack_js",
        "//:pack_template"
    ],
    outs = ["pack.js"],
    cmd = "awk 'FNR==1{print \"\"}1' $(SRCS) > $@",
)
