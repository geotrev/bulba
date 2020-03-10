import path from "path"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

const banner = require("./.bin/banner")
const input = path.resolve(__dirname, "src/upgraded-component.js")
const plugins = [resolve(), commonjs()]

if (process.env.NODE_ENV === "publish") {
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
      mangle: { reserved: ["UpgradedComponent"] },
    })
  )
}

export default [
  {
    input,
    plugins,
    output: {
      banner,
      format: "iife",
      file: path.resolve(__dirname, "lib/upgraded-component.js"),
      sourcemap: true,
      name: "UpgradedComponent",
    },
  },
  {
    input,
    plugins,
    output: {
      banner,
      format: "cjs",
      file: path.resolve(__dirname, "lib/upgraded-component.cjs.js"),
      sourcemap: true,
      name: "UpgradedComponent",
    },
  },
  {
    input,
    plugins,
    output: {
      banner,
      format: "esm",
      file: path.resolve(__dirname, "lib/upgraded-component.esm.js"),
      sourcemap: true,
      name: "UpgradedComponent",
    },
  },
]
