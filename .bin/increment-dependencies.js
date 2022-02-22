#!/usr/bin/env node

import fs from "fs"
import path from "path"
import { reporter, pkgReporter } from "./reporter.js"
import { ROOT_PACKAGE_FILE } from "./constants.js"

export function incrementDependencies(args, config, entry) {
  pkgReporter.start("Increment co-dependencies")

  let failures = null
  const { getPackage, dir } = entry
  const pkgContent = getPackage()
  const scope = entry.name.split("/")[0]
  const dependencies = []
  const rangePrefix = config.codependencies.rangePrefix
  const types = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]

  types.forEach((type) => {
    if (!pkgContent[type]) return
    const packageNames = Object.keys(pkgContent[type])

    if (packageNames.length) {
      dependencies.push({ type, packageNames })
    }
  })

  if (dependencies.length) {
    failures = false

    dependencies.forEach(({ type, packageNames }) => {
      packageNames
        .filter((name) => name.startsWith(scope))
        .forEach((name) => {
          pkgContent[type][name] = `${rangePrefix}${pkgContent.version}`
        })
    })

    const newPkgJson = JSON.stringify(pkgContent, null, 2)
    const writeCommand = `fs.writeFileSync(path.resolve(dir, "${ROOT_PACKAGE_FILE}"), newPkgJson, "utf8")`

    if (args.dryRun) {
      pkgReporter.info(writeCommand)
    } else {
      try {
        fs.writeFileSync(
          path.resolve(dir, ROOT_PACKAGE_FILE),
          newPkgJson + "\n",
          "utf8"
        )
      } catch (e) {
        failures = true
        console.log("Error:", e)
      }
    }
  }

  if (failures) {
    reporter.fail(
      "package.json missing: " + path.resolve(dir, ROOT_PACKAGE_FILE)
    )
  } else if (failures === false) {
    pkgReporter.succeed("Co-dependencies updated")
  } else {
    pkgReporter.succeed("No co-dependencies detected")
  }
}
