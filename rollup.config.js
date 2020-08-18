import path from "path"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import { banner } from "./build/banner"

const FORMAT_TYPES = ["cjs", "es"]
const FORMAT_UMD = "umd"
const input = path.resolve(__dirname, "src/index.js")
const basePlugins = [resolve(), commonjs(), babel({ babelHelpers: "bundled" })]

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

const moduleOutputs = FORMAT_TYPES.map((format) => ({
  ...baseOutput(format),
  plugins: process.env.BABEL_ENV === "publish" ? [terserPlugin] : undefined,
  file: path.resolve(__dirname, `lib/upgraded-element.${format}.js`),
}))

const umdOutputs = [
  {
    ...baseOutput(FORMAT_UMD),
    file: path.resolve(__dirname, `dist/upgraded-element.js`),
  },
  {
    ...baseOutput(FORMAT_UMD),
    plugins: [terserPlugin],
    file: path.resolve(__dirname, `dist/upgraded-element.min.js`),
  },
]

export default {
  input,
  plugins: basePlugins,
  output: [...moduleOutputs, ...umdOutputs],
}
