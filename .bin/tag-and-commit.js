#!/usr/bin/env node

import { triggerCmd } from "./trigger-cmd.js"

export async function tagAndCommit(args, config) {
  const {
    tag: shouldTag,
    commit: shouldCommit,
    push: shouldPush,
    commitMessage,
    tagMessage,
  } = config.git
  const { precommit, pretag, prepush, postcommit, posttag, postpush } =
    config.hooks
  const VERSION_INSERT = "${version}"

  const commitMsg =
    commitMessage.indexOf(VERSION_INSERT) > -1
      ? commitMessage.replace(VERSION_INSERT, config.releaseVersion)
      : commitMessage
  const tagMsg =
    tagMessage.indexOf(VERSION_INSERT) > -1
      ? tagMessage.replace(VERSION_INSERT, config.releaseVersion)
      : tagMessage
  const commitCmd = `git commit -m '${commitMsg}'`
  const tagCmd = `git tag -a -m '${tagMsg}' ${config.releaseVersion}`
  const pushCmd = "git push --follow-tags"

  if (precommit) await triggerCmd({ args, cmd: precommit, step: "Precommit" })
  await triggerCmd({
    cmd: commitCmd,
    step: "Commit",
    shouldRun: shouldCommit,
    args,
  })
  if (postcommit) {
    await triggerCmd({ args, cmd: postcommit, step: "Postcommit" })
  }

  if (pretag) await triggerCmd({ args, cmd: pretag, step: "Pretag" })
  await triggerCmd({
    cmd: tagCmd,
    step: "Tag",
    shouldRun: shouldCommit && shouldTag,
    args,
  })
  if (posttag) await triggerCmd({ args, cmd: posttag, step: "Posttag" })

  if (prepush) await triggerCmd({ args, cmd: prepush, step: "Prepush" })
  await triggerCmd({
    cmd: pushCmd,
    step: "Push",
    shouldRun: shouldCommit && shouldTag && shouldPush,
    args,
  })
  if (postpush) await triggerCmd({ args, cmd: postpush, step: "Postpush" })
}
