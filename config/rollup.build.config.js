import path from "path"
import { terser } from "rollup-plugin-terser"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import replace from "@rollup/plugin-replace"
import { nodeResolve } from "@rollup/plugin-node-resolve"

const currentDir = process.cwd()
const year = new Date().getFullYear()
const RenderTypes = {
  TEMPLATE: "template",
  JSX: "jsx",
}
const Environments = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
}
const Formats = ["esm", "cjs"]
const GLOBAL_NAME = "Rotom"
const external = ["snabbdom", "omdomdom"]

const banner = async () => {
  const { default: pkg } = await import("../package.json")

  return `/*!
  * @license MIT (https://github.com/geotrev/rotom/blob/master/LICENSE)
  * Rotom v${pkg.version} (${pkg.homepage})
  * Copyright ${year} ${pkg.author}
  */`
}

const terserPlugin = terser({
  output: {
    comments: (_, comment) => {
      const { value, type } = comment

      if (type === "comment2") {
        return /@preserve|@license|@cc_on/i.test(value)
      }
    },
  },
})
const plugins = [
  babel({
    babelHelpers: "bundled",
    comments: false,
    exclude: "node_modules",
  }),
  commonjs(),
  nodeResolve(),
]

function replacePlugin(value) {
  return replace({
    preventAssignment: true,
    values: { BUILD_ENV: JSON.stringify(value) },
  })
}

function baseOutput(format) {
  return {
    banner,
    format,
    name: GLOBAL_NAME,
  }
}

function createDevOutputs(type) {
  return Formats.reduce(
    (outputs, format) => [
      ...outputs,
      {
        ...baseOutput(format),
        file: path.resolve(currentDir, `lib/rotom.${type}.${format}.js`),
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
        ...baseOutput(format),
        file: path.resolve(currentDir, `lib/rotom.${type}.${format}.min.js`),
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
      input: path.resolve(currentDir, "src/rotom.jsx.js"),
      output: createDevOutputs(RenderTypes.JSX),
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(currentDir, "src/rotom.jsx.js"),
      output: createProdOutputs(RenderTypes.JSX),
      external,
      plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
    },
    {
      input: path.resolve(currentDir, "src/rotom.template.js"),
      output: createDevOutputs(RenderTypes.TEMPLATE),
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(currentDir, "src/rotom.template.js"),
      output: createProdOutputs(RenderTypes.TEMPLATE),
      external,
      plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
    },
  ]
}

function createDistConfigs() {
  const baseDistOutput = {
    banner,
    format: "umd",
    name: GLOBAL_NAME,
    globals: { omdomdom: "Omdomdom" },
  }

  return [
    {
      input: path.resolve(currentDir, "src/rotom.template.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(currentDir, "dist/rotom.template.js"),
        sourcemap: true,
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(currentDir, "src/rotom.template.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(currentDir, "dist/rotom.template.min.js"),
        sourcemap: true,
        plugins: [terserPlugin],
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
    },
  ]
}

function createSnabbdomConfig() {
  return {
    input: path.resolve(currentDir, "vendor/snabbdom.js"),
    output: [
      {
        file: path.resolve(currentDir, "dist/snabbdom.js"),
        format: "umd",
        name: "snabbdom",
        sourcemap: true,
      },
      {
        file: path.resolve(currentDir, "dist/snabbdom.min.js"),
        format: "umd",
        name: "snabbdom",
        sourcemap: true,
        plugins: [terserPlugin],
      },
    ],
    plugins,
  }
}

export default [
  createSnabbdomConfig(),
  ...createLibConfigs(),
  ...createDistConfigs(),
]
