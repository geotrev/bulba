#!/usr/bin/env node

/**
 * This script runs during release-it's `after:bump` hook.
 *
 * It reads any co-dependencies in this monorepo and bumps their version
 * to match the now-bumped version before publishing.
 */

import fs from "fs"

function increment() {
  const pkgPath = `${process.cwd()}/package.json`
  const content = JSON.parse(fs.readFileSync(pkgPath, "utf8"))

  Object.keys(content.dependencies)
    .filter((dep) => dep.startsWith("@bulba"))
    .map((dep) => {
      return [dep, content.dependencies[dep].slice(1)]
    })
    .forEach(([name, version]) => {
      if (content.version === version) return
      content.dependencies[name] = `^${content.version}`
    })

  fs.writeFileSync(pkgPath, JSON.stringify(content, null, 2) + "\n", "utf8")
}

increment()
