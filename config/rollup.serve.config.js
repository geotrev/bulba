import path from "path"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import babel from "@rollup/plugin-babel"
import serve from "rollup-plugin-serve"
import livereload from "rollup-plugin-livereload"
import findUnused from "rollup-plugin-unused"
import commonjs from "@rollup/plugin-commonjs"

const { ENTRY, CDN } = process.env
const isCdnMode = CDN === "true"
const dirname = process.cwd()

const TEST_PATH = path.resolve(dirname, ENTRY ? `test/${ENTRY}` : "test")
const INPUT_PATH = TEST_PATH + "/examples.js"
const OUTPUT_PATH = TEST_PATH + "/bundle.js"
const ROTOM_EXTERNAL_ID = path.resolve(dirname, `test/${ENTRY}/rotom.js`)

export default {
  input: INPUT_PATH,
  output: {
    file: OUTPUT_PATH,
    format: "iife",
    globals: isCdnMode
      ? {
          [ROTOM_EXTERNAL_ID]: "Rotom",
          omdomdom: "Omdomdom",
          snabbdom: "snabbdom",
        }
      : {},
  },
  external: isCdnMode ? [ROTOM_EXTERNAL_ID, "omdomdom", "snabbdom"] : [],
  plugins: [
    findUnused(),
    babel({ babelHelpers: "bundled", exclude: "node_modules" }),
    nodeResolve(),
    commonjs(),
    livereload({ watch: TEST_PATH }),
    serve({
      open: true,
      contentBase: TEST_PATH,
      historyApiFallback: true,
      host: "localhost",
      port: 3000,
    }),
    replace({
      preventAssignment: true,
      values: { BUILD_ENV: JSON.stringify("development") },
    }),
  ],
}
