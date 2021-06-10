import path from "path"
import { terser } from "rollup-plugin-terser"
import babel from "@rollup/plugin-babel"
import { nodeResolve } from "@rollup/plugin-node-resolve"

const currentDir = process.cwd()
const RenderTypes = {
  TEMPLATE: "template",
  JSX: "jsx",
}
const Formats = ["esm", "cjs"]
const PKG_NAME = "rotom"

// shared config

const external = ["snabbdom"]
const plugins = [
  babel({
    babelHelpers: "bundled",
    comments: false,
    exclude: "node_modules",
  }),
  nodeResolve(),
]

// create outputs array

function createOutput(suffix) {
  return Formats.reduce(
    (outputs, format) => [
      ...outputs,
      {
        format,
        file: path.resolve(currentDir, `lib/rotom.${suffix}.${format}.js`),
        name: PKG_NAME,
        sourcemap: true,
      },
      {
        format,
        file: path.resolve(currentDir, `lib/rotom.${suffix}.${format}.min.js`),
        name: PKG_NAME,
        sourcemap: true,
        plugins: [terser({ mangle: { reserved: [PKG_NAME] } })],
      },
    ],
    []
  )
}

function createConfig(type) {
  return {
    input: path.resolve(currentDir, `src/rotom.${type}.js`),
    output: createOutput(type),
    external,
    plugins,
  }
}

// export config

export default [
  createConfig(RenderTypes.TEMPLATE),
  createConfig(RenderTypes.JSX),
]
