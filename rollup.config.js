import path from "path"
import babel from "@rollup/plugin-babel"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import { banner } from "./build/banner"

const Formats = {
  CJS: "cjs",
  ES: "es",
  UMD: "umd",
}
const input = path.resolve(__dirname, "src/index.js")
const basePlugins = [nodeResolve(), babel({ babelHelpers: "bundled" })]

const terserPlugin = terser({
  output: {
    comments: (_, comment) => {
      const { value, type } = comment

      if (type === "comment2") {
        return /@preserve|@license|@cc_on/i.test(value)
      }
    },
  },
  mangle: { reserved: ["UpgradedElement"] },
})

const baseOutput = (format) => ({
  banner,
  format,
  name: "UpgradedElement",
  sourcemap: true,
})

let moduleOutputs = [Formats.ES, Formats.CJS].map((format) => ({
  ...baseOutput(format),
  file: path.resolve(__dirname, `lib/upgraded-element.${format}.js`),
}))

const umdOutputs = [
  {
    ...baseOutput(Formats.UMD),
    file: path.resolve(__dirname, `dist/upgraded-element.js`),
  },
]

if (process.env.BABEL_ENV === "publish") {
  moduleOutputs = [
    ...moduleOutputs,
    ...[Formats.ES, Formats.CJS].map((format) => ({
      ...baseOutput(format),
      plugins: process.env.BABEL_ENV === "publish" ? [terserPlugin] : [],
      file: path.resolve(__dirname, `lib/upgraded-element.${format}.min.js`),
    })),
  ]

  umdOutputs.push({
    ...baseOutput(Formats.UMD),
    plugins: [terserPlugin],
    file: path.resolve(__dirname, `dist/upgraded-element.min.js`),
  })
}

export default {
  input,
  plugins: basePlugins,
  output: [...moduleOutputs, ...umdOutputs],
}
