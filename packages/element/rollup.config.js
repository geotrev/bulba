import getBaseConfig from "../../config/rollup.base.config"
import path from "path"

const { baseConfig, terserPlugin, replacePlugin, Environments, plugins } =
  getBaseConfig(process.cwd(), "Bulba")

const GLOBAL_NAME = "Bulba"

function createDistConfigs() {
  const external = [
    "@bulba/element",
    "@bulba/jsx",
    "@bulba/template",
    "@bulba/utils",
  ]
  const baseDistOutput = {
    format: "umd",
    name: GLOBAL_NAME,
    globals: {
      "@bulba/element": GLOBAL_NAME,
      "@bulba/jsx": GLOBAL_NAME,
      "@bulba/template": GLOBAL_NAME,
      "@bulba/utils": GLOBAL_NAME,
    },
  }

  return [
    {
      input: path.resolve(process.cwd(), "src/bundle-jsx.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/bulba-jsx.js"),
        sourcemap: true,
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(process.cwd(), "src/bundle-jsx.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/bulba-jsx.min.js"),
        sourcemap: true,
        plugins: [terserPlugin],
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
    },
    {
      input: path.resolve(process.cwd(), "src/bundle-template.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/bulba-template.js"),
        sourcemap: true,
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(process.cwd(), "src/bundle-template.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/bulba-template.min.js"),
        sourcemap: true,
        plugins: [terserPlugin],
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
    },
  ]
}

export default [...createDistConfigs(), ...baseConfig]
