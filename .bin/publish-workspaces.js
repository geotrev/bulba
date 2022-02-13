#!/usr/bin/env node

import { getArgs } from "./get-args.js"
import { normalizeConfig } from "./normalize-config.js"
import { versionAndPublish } from "./version-and-publish.js"
import { tagAndCommit } from "./tag-and-commit.js"
import { triggerCmd } from "./trigger-cmd.js"
// import { releaseToGithub } from "./release-to-gh.js"

async function releaseAll() {
  const args = getArgs()
  const config = normalizeConfig()
  const { prepublish, postpublish } = config.hooks

  if (prepublish) {
    await triggerCmd({
      args,
      cmd: prepublish,
      step: "Prepublish",
    })
  }

  await versionAndPublish(args, config)

  if (postpublish) {
    await triggerCmd({
      args,
      cmd: postpublish,
      step: "Postpublish",
    })
  }

  await tagAndCommit(args, config)
  // await releaseToGithub(args, config)
}

releaseAll()
