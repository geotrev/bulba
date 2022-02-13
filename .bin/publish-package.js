#!/usr/bin/env node

import { exec } from "./exec-promise.js"
import { reporter, pkgReporter } from "./reporter.js"

export async function publishPackage(args, entry) {
  pkgReporter.start(`Publish ${entry.name}`)

  let failures = false
  const pubTag = args.npmTag || args.preid || "latest"
  const pubCommand = `npm publish -w ${entry.name} --tag ${pubTag}`
  const addChangesCommand = "git add . -u"

  if (args.dryRun) {
    pkgReporter.info(addChangesCommand)
    pkgReporter.info(pubCommand)
  } else {
    try {
      await exec(addChangesCommand)
      await exec(pubCommand)
    } catch (e) {
      failures = true
      console.log("Error:", e)
    }
  }

  if (failures) {
    reporter.fail(`Something went wrong releasing ${entry.name}`)
  } else {
    pkgReporter.succeed("Publish successful")
  }
}
