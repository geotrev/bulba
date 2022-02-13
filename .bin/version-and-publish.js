#!/usr/bin/env node

import semver from "semver"
import { reporter } from "./reporter.js"
import { bumpVersion } from "./bump-version.js"
import { publishPackage } from "./publish-package.js"

export async function versionAndPublish(args, config) {
  let failures = false
  const packages = config.packages
  const length = packages.length

  for (let i = 0; i < length; i++) {
    const entry = packages[i]
    const { getPackage, name } = entry
    const pkgContent = getPackage()

    // Get new version

    const newVersion = args.preid
      ? semver.inc(pkgContent.version, args.target || "prerelease", args.preid)
      : semver.inc(pkgContent.version, args.target, args.preid)

    if (!newVersion) {
      reporter.fail("Invalid target version requested")
      process.exit(1)
    }

    config.releaseVersion = newVersion

    console.log("")
    reporter.stopAndPersist({
      text: `${name}@${newVersion}`,
      symbol: "📦",
    })

    const versioned = await bumpVersion(args, config, entry, newVersion)

    if (versioned) {
      await publishPackage(args, entry)
    } else {
      failures = true
    }
  }

  if (!failures) {
    console.log("")
    reporter.succeed("All packages published without errors")
    console.log("")
  }
}
