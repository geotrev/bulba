import path from "path"
import { terser } from "rollup-plugin-terser"
import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import replace from "@rollup/plugin-replace"
import { nodeResolve } from "@rollup/plugin-node-resolve"

const Environments = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
}
const Formats = ["es", "cjs"]
const external = ["@bulba/utils"]
const terserPlugin = terser()
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

export default function (root, globalName) {
  function baseOutput(format) {
    return { format, name: globalName }
  }

  function createDevOutputs() {
    return Formats.reduce(
      (outputs, format) => [
        ...outputs,
        {
          ...baseOutput(format),
          file: path.resolve(root, `lib/index.${format}.js`),
          sourcemap: true,
        },
      ],
      []
    )
  }

  function createProdOutputs() {
    return Formats.reduce(
      (outputs, format) => [
        ...outputs,
        {
          ...baseOutput(format),
          file: path.resolve(root, `lib/index.${format}.min.js`),
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
        input: path.resolve(root, "src/index.js"),
        output: createDevOutputs(),
        external,
        plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
      },
      {
        input: path.resolve(root, "src/index.js"),
        output: createProdOutputs(),
        external,
        plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
      },
    ]
  }

  return {
    plugins,
    Environments,
    replacePlugin,
    terserPlugin,
    baseConfig: createLibConfigs(),
  }
}
