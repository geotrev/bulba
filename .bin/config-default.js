export const configDefault = {
  codependencies: {
    bump: false,
    rangePrefix: "^",
  },
  hooks: {
    prepublish: "",
    postpublish: "",
    precommit: "",
    postcommit: "",
    pretag: "",
    posttag: "",
    prepush: "",
    postpush: "",
  },
  git: {
    commitMessage: "Release ${version}",
    tagMessage: "Release ${version}",
    commit: true,
    tag: true,
    push: true,
  },
}
