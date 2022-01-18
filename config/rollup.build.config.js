import path from "path"
import { terser } from "rollup-plugin-terser"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import replace from "@rollup/plugin-replace"
import { nodeResolve } from "@rollup/plugin-node-resolve"

const currentDir = process.cwd()
const year = new Date().getFullYear()
const GLOBAL_NAME = "Rotom"
const Environments = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
}
const CJS = "cjs"
const external = ["snabbdom", "omdomdom"]

const BANNER_ENABLED = false

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
const baseOutput = {
  banner: BANNER_ENABLED ? banner : undefined,
  format: CJS,
  name: GLOBAL_NAME,
}

function replacePlugin(value) {
  return replace({
    preventAssignment: true,
    values: { BUILD_ENV: JSON.stringify(value) },
  })
}

function createLibConfigs() {
  return [
    {
      input: path.resolve(currentDir, "src/index.js"),
      output: {
        ...baseOutput,
        file: path.resolve(currentDir, `lib/rotom.${CJS}.js`),
        sourcemap: true,
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(currentDir, "src/index.js"),
      output: {
        ...baseOutput,
        file: path.resolve(currentDir, `lib/rotom.${CJS}.min.js`),
        sourcemap: true,
        plugins: [terserPlugin],
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
    },
  ]
}

function createDistConfigs() {
  const baseDistOutput = {
    banner: BANNER_ENABLED ? banner : undefined,
    format: "umd",
    name: GLOBAL_NAME,
    globals: { omdomdom: "Omdomdom", snabbdom: "snabbdom" },
  }

  return [
    {
      input: path.resolve(currentDir, "src/index.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(currentDir, "dist/rotom.js"),
        sourcemap: true,
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(currentDir, "src/index.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(currentDir, "dist/rotom.min.js"),
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
