import path from "path"
import babel from "@rollup/plugin-babel"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import { terser } from "rollup-plugin-terser"

const currentDir = process.cwd()
const dirParts = currentDir.split("/")
const PKG_SHORT_NAME = dirParts[dirParts.length - 1]

const Formats = {
  CJS: "cjs",
  ES: "es",
  UMD: "umd",
}
const input = path.resolve(currentDir, "src/index.js")
const basePlugins = [
  commonjs(),
  nodeResolve(),
  babel({
    babelHelpers: "bundled",
    comments: false,
    exclude: "node_modules",
  }),
]

const terserPlugin = terser({
  mangle: { reserved: [PKG_SHORT_NAME] },
})

const baseOutput = (format) => ({
  format,
  name: `@rotom/${PKG_SHORT_NAME}`,
  sourcemap: true,
  // globals: {
  //   "rotom-template": "stringToHtml",
  //   "rotom-jsx": "jsxToHtml",
  // },
})

// Build outputs

let moduleOutputs = [Formats.ES, Formats.CJS].map((format) => ({
  ...baseOutput(format),
  file: path.resolve(currentDir, `lib/${PKG_SHORT_NAME}.${format}.js`),
}))

const umdOutputs = [
  {
    ...baseOutput(Formats.UMD),
    file: path.resolve(currentDir, `dist/${PKG_SHORT_NAME}.js`),
  },
]

// If publishing, include the minified and uglified versions

if (process.env.BABEL_ENV === "publish") {
  moduleOutputs = [
    ...moduleOutputs,
    ...[Formats.ES, Formats.CJS].map((format) => ({
      ...baseOutput(format),
      plugins: [terserPlugin],
      file: path.resolve(currentDir, `lib/${PKG_SHORT_NAME}.${format}.min.js`),
    })),
  ]

  umdOutputs.push({
    ...baseOutput(Formats.UMD),
    plugins: [terserPlugin],
    file: path.resolve(currentDir, `dist/${PKG_SHORT_NAME}.min.js`),
  })
}

// Export the config

export default {
  input,
  output: [...moduleOutputs, ...umdOutputs],
  // external: ["rotom-template", "rotom-jsx"],
  plugins: basePlugins,
}
