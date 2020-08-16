import path from "path"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import { banner } from "./build/banner"

const MODULE_TYPES = ["cjs", "es"]
const input = path.resolve(__dirname, "src")
const plugins = [resolve(), commonjs(), babel({ babelHelpers: "bundled" })]

if (process.env.BABEL_ENV === "publish") {
  plugins.push(
    terser({
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
  )
}

export default {
  input,
  plugins,
  output: MODULE_TYPES.map(format => ({
    banner,
    format,
    file: path.resolve(__dirname, `lib/upgraded-element.${format}.js`),
    sourcemap: true,
    name: "UpgradedElement",
  })),
}
