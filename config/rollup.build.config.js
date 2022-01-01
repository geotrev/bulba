import path from "path"
import { terser } from "rollup-plugin-terser"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import replace from "@rollup/plugin-replace"
import { nodeResolve } from "@rollup/plugin-node-resolve"

const currentDir = process.cwd()
const RenderTypes = {
  TEMPLATE: "template",
  JSX: "jsx",
}
const Environments = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
}
const Formats = ["esm", "cjs"]
const PKG_NAME = "rotom"
const external = ["snabbdom", "omdomdom"]
const plugins = [
  babel({
    babelHelpers: "bundled",
    comments: false,
    exclude: "node_modules",
  }),
  commonjs(),
  nodeResolve(),
]
const terserPlugin = terser()

function replacePlugin(value) {
  return replace({
    preventAssignment: true,
    values: { BUILD_ENV: JSON.stringify(value) },
  })
}

function createDevOutputs(type) {
  return Formats.reduce(
    (outputs, format) => [
      ...outputs,
      {
        format,
        file: path.resolve(currentDir, `lib/rotom.${type}.${format}.js`),
        name: PKG_NAME,
        sourcemap: true,
      },
    ],
    []
  )
}

function createProdOutputs(type) {
  return Formats.reduce(
    (outputs, format) => [
      ...outputs,
      {
        format,
        file: path.resolve(currentDir, `lib/rotom.${type}.${format}.min.js`),
        name: PKG_NAME,
        sourcemap: true,
        plugins: [terserPlugin],
      },
    ],
    []
  )
}

function createLibConfigs() {
  return [
    {
      input: path.resolve(currentDir, `src/rotom.jsx.js`),
      output: createDevOutputs(RenderTypes.JSX),
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(currentDir, `src/rotom.jsx.js`),
      output: createProdOutputs(RenderTypes.JSX),
      external,
      plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
    },
    {
      input: path.resolve(currentDir, `src/rotom.template.js`),
      output: createDevOutputs(RenderTypes.TEMPLATE),
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(currentDir, `src/rotom.template.js`),
      output: createProdOutputs(RenderTypes.TEMPLATE),
      external,
      plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
    },
  ]
}

function createDistConfigs() {
  return [
    {
      input: path.resolve(currentDir, "src/rotom.template.js"),
      output: {
        format: "umd",
        file: path.resolve(currentDir, `dist/rotom.template.js`),
        name: PKG_NAME,
        globals: { omdomdom: "omdomdom" },
        sourcemap: true,
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(currentDir, "src/rotom.template.js"),
      output: {
        format: "umd",
        file: path.resolve(currentDir, `dist/rotom.template.min.js`),
        name: PKG_NAME,
        globals: { omdomdom: "omdomdom" },
        sourcemap: true,
        plugins: [terserPlugin],
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
    },
  ]
}

export default [...createLibConfigs(), ...createDistConfigs()]
