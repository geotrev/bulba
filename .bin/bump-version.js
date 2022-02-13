#!/usr/bin/env node

import { exec } from "./exec-promise.js"
import { pkgReporter, reporter } from "./reporter.js"
import { incrementDependencies } from "./increment-dependencies.js"

export async function bumpVersion(args, config, entry, newVersion) {
  pkgReporter.start(`Bump ${entry.name} to v${newVersion}`)

  let failures = false
  const incCommand = `npm version -w ${entry.name} ${newVersion} --no-git-tag-version`

  if (args.dryRun) {
    pkgReporter.info(incCommand)
  } else {
    try {
      await exec(incCommand)
    } catch (e) {
      failures = true
      console.log("Error", e)
    }
  }

  if (config.codependencies.bump) {
    incrementDependencies(args, config, entry)
  }

  if (failures) {
    reporter.fail(
      `Something went wrong bumping ${entry.name} to v${newVersion}`
    )
    return false
  } else {
    pkgReporter.succeed(`Version successful`)
    return true
  }
}
