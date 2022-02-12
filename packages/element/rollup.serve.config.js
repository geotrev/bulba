import path from "path"
import alias from "@rollup/plugin-alias"
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

const TEST_PATH = path.resolve(dirname, `smoke-test/${ENTRY}`)
const INPUT_PATH = TEST_PATH + "/examples.js"
const OUTPUT_PATH = TEST_PATH + "/bundle.js"
const BULBA_EXTERNAL_ID = path.resolve(dirname, `smoke-test/${ENTRY}/bulba.js`)
const CDN_GLOBALS = {
  "@bulba/jsx": "Bulba",
  "@bulba/template": "Bulba",
  "@bulba/utils": "Bulba",
}
const moduleAliases = {
  "@bulba/jsx": "../jsx/src/index.js",
  "@bulba/template": "../template/src/index.js",
  "@bulba/utils": "../utils/src/index.js",
}

export default {
  input: INPUT_PATH,
  output: {
    file: OUTPUT_PATH,

    format: "iife",
    globals: isCdnMode
      ? {
          [BULBA_EXTERNAL_ID]: "Bulba",
          ...CDN_GLOBALS,
        }
      : {},
  },
  external: isCdnMode ? [BULBA_EXTERNAL_ID, Object.keys(CDN_GLOBALS)] : [],
  plugins: [
    alias({ entries: moduleAliases }),
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
