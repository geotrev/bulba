import alias from "@rollup/plugin-alias"
import path from "path"
import getBaseConfig from "../../config/rollup.base.config"

const { baseConfig, terserPlugin, replacePlugin, Environments, plugins } =
  getBaseConfig(process.cwd(), "Bulba")

const GLOBAL_NAME = "Bulba"
const moduleAliases = {
  "@bulba/jsx": "../jsx/src/index.js",
  "@bulba/template": "../template/src/index.js",
  "@bulba/utils": "../utils/src/index.js",
}

function createDistConfigs() {
  const baseDistOutput = {
    format: "umd",
    name: GLOBAL_NAME,
  }

  return [
    {
      input: path.resolve(process.cwd(), "src/bundle-jsx.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/bulba-jsx.js"),
        sourcemap: true,
      },
      plugins: [
        ...plugins,
        alias({ entries: moduleAliases }),
        replacePlugin(Environments.DEVELOPMENT),
      ],
    },
    {
      input: path.resolve(process.cwd(), "src/bundle-jsx.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/bulba-jsx.min.js"),
        sourcemap: true,
        plugins: [terserPlugin],
      },
      plugins: [
        ...plugins,
        alias({ entries: moduleAliases }),
        replacePlugin(Environments.PRODUCTION),
      ],
    },
    {
      input: path.resolve(process.cwd(), "src/bundle-template.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/bulba-template.js"),
        sourcemap: true,
      },
      plugins: [
        ...plugins,
        alias({ entries: moduleAliases }),
        replacePlugin(Environments.DEVELOPMENT),
      ],
    },
    {
      input: path.resolve(process.cwd(), "src/bundle-template.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/bulba-template.min.js"),
        sourcemap: true,
        plugins: [terserPlugin],
      },
      plugins: [
        ...plugins,
        alias({ entries: moduleAliases }),
        replacePlugin(Environments.PRODUCTION),
      ],
    },
  ]
}

export default [...createDistConfigs(), ...baseConfig]
