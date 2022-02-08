import getBaseConfig from "../../config/rollup.base.config"
import path from "path"

const { baseConfig, terserPlugin, replacePlugin, Environments, plugins } =
  getBaseConfig(process.cwd(), "Rotom")

const GLOBAL_NAME = "Rotom"

function createDistConfigs() {
  const external = [
    "@rotom/element",
    "@rotom/jsx",
    "@rotom/template",
    "@rotom/utils",
  ]
  const baseDistOutput = {
    format: "umd",
    name: GLOBAL_NAME,
    globals: {
      "@rotom/element": GLOBAL_NAME,
      "@rotom/jsx": GLOBAL_NAME,
      "@rotom/template": GLOBAL_NAME,
      "@rotom/utils": GLOBAL_NAME,
    },
  }

  return [
    {
      input: path.resolve(process.cwd(), "src/bundle-jsx.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/rotom-jsx.js"),
        sourcemap: true,
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(process.cwd(), "src/bundle-jsx.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/rotom-jsx.min.js"),
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
        file: path.resolve(process.cwd(), "dist/rotom-template.js"),
        sourcemap: true,
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.DEVELOPMENT)],
    },
    {
      input: path.resolve(process.cwd(), "src/bundle-template.js"),
      output: {
        ...baseDistOutput,
        file: path.resolve(process.cwd(), "dist/rotom-template.min.js"),
        sourcemap: true,
        plugins: [terserPlugin],
      },
      external,
      plugins: [...plugins, replacePlugin(Environments.PRODUCTION)],
    },
  ]
}

export default [...createDistConfigs(), ...baseConfig]
