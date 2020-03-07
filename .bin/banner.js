const path = require("path")
const pkg = require(path.resolve(__dirname, "../package.json"))
const year = new Date().getFullYear()

// add to copyright line when its no longer 2020
// -${year} ${pkg.author}

const banner = `/*!
  * @license MIT (https://github.com/geotrev/undernet/blob/master/LICENSE)
  * Rotom v${pkg.version} (${pkg.homepage})
  * Copyright 2020
  */`

module.exports = banner
