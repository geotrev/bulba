const path = require("path")

const READONLY = "readonly"
const SRC_PATH = path.resolve(__dirname, "src")
const NODE_MODULES_PATH = path.resolve(__dirname, "node_modules")

module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  extends: ["eslint:recommended", "prettier", "prettier/babel"],
  globals: {
    Atomics: READONLY,
    SharedArrayBuffer: READONLY,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js"],
        paths: [SRC_PATH],
        moduleDirectory: [NODE_MODULES_PATH],
      },
    },
    "import/ignore": [".(scss)$"],
  },
}
