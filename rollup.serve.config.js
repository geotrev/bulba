import path from "path"
import alias from "@rollup/plugin-alias"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import babel from "@rollup/plugin-babel"
import server from "rollup-plugin-dev"
import commonjs from "@rollup/plugin-commonjs"

const { ENTRY, CDN } = process.env
const isCdnMode = CDN === "true"
const dirname = process.cwd()

const TEST_PATH = path.resolve(dirname, `preview/${ENTRY}`)
const INPUT_PATH = TEST_PATH + "/examples.js"
const OUTPUT_PATH = TEST_PATH + "/bundle.js"
const CDN_GLOBALS = {
  "@bulba/element": "Bulba",
  "@bulba/jsx": "Bulba",
  "@bulba/template": "Bulba",
  "@bulba/utils": "Bulba",
}

// Use aliases in development to allow sourcecode
// changes to trigger rebuilds
const moduleAliases = {
  "@bulba/element": path.resolve(dirname, "packages/element/src/index.js"),
  "@bulba/jsx": path.resolve(dirname, "packages/jsx/src/index.js"),
  "@bulba/template": path.resolve(dirname, "packages/template/src/index.js"),
  "@bulba/utils": path.resolve(dirname, "packages/utils/src/index.js"),
}

export default {
  input: INPUT_PATH,
  output: {
    file: OUTPUT_PATH,

    format: "iife",
    globals: isCdnMode ? CDN_GLOBALS : {},
  },
  external: isCdnMode ? Object.keys(CDN_GLOBALS) : [],
  plugins: [
    alias({ entries: moduleAliases }),
    babel({ babelHelpers: "bundled", exclude: "node_modules" }),
    replace({
      preventAssignment: true,
      values: { BUILD_ENV: JSON.stringify("development") },
    }),
    nodeResolve(),
    commonjs(),
    server({ dirs: [TEST_PATH], port: 3000 }),
  ],
}
