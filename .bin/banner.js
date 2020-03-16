const path = require("path")
const pkg = require(path.resolve(__dirname, "../package.json"))
const year = new Date().getFullYear()

const banner = `/*!
  * @license MIT (https://github.com/geotrev/upgraded-element/blob/master/LICENSE)
  * upgraded-element v${pkg.version} (${pkg.homepage})
  * Copyright ${year} ${pkg.author}
  */`

module.exports = banner
