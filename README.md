<h2 align="center"><code><🔼>Rotom<&#47;🔼></code></h2>
<p align="center">Intuitive, deterministic, and extendable base class enabling modern architecture strategies in Web Components.</p>
<br>
<p align="center">
  <a href="https://www.npmjs.com/package/rotom"><img src="https://img.shields.io/npm/v/rotom.svg?sanitize=true&style=flat-square" alt="Version"></a>
  <a href="https://www.npmjs.com/package/rotom"><img src="https://img.shields.io/npm/l/rotom.svg?sanitize=true&style=flat-square" alt="License"></a>
  <a href="https://www.npmjs.com/package/rotom"><img src="https://badgen.net/circleci/github/geotrev/rotom/master?style=flat-square" alt="Circle CI status (master)" /></a>
  <a href="https://www.npmjs.com/package/rotom"><img src="https://badgen.net/bundlephobia/minzip/rotom?style=flat-square" alt="bundle size" /></a>
  <a href="https://www.npmjs.com/package/rotom"><img src="https://badgen.net/david/dep/geotrev/rotom?style=flat-square" alt="dependencies" /></a>
  <a href="https://www.npmjs.com/package/rotom"><img src="https://badgen.net/david/dev/geotrev/rotom?style=flat-square" alt="devDependencies" /></a>
</p>

**🧾 Explore**

- 📥 [Install](#install)
- 🎮 [Getting Started](#getting-started)
- 🌍 [Browser Support](#browser-support)
- 📈 [Performance](#performance)
- 🤝 [Contribute](#contribute)

## Install

To get going, you need to install both `rotom` and one of two rendering packages: [`omdomdom`](https://www.github.com/geotrev/omdomdom) or [`snabbdom`](https://www.github.com/snabbdom/snabbdom).

Both use virtual DOMs. `omdomdom` is written with strings while `snabbdom` prefers JSX.

Note that even if you use the default renderer, you still need to install the package so `rotom` can fetch it.

### NPM or Yarn

```sh
$ npm i rotom omdomdom@2
# or
$ npm i rotom snabbdom@3
```

or

```sh
$ yarn i rotom omdomdom@2
# or
$ yarn i rotom snabbdom@3
```

### Raw Files

[ES Module](https://cdn.jsdelivr.net/npm/rotom/lib/rotom.esm.js) / [CommonJS Module](https://cdn.jsdelivr.net/npm/rotom/lib/rotom.cjs.js) / [Browser Bundle](https://cdn.jsdelivr.net/npm/rotom/dist/rotom.js) / [Browser Bundle (minified)](https://cdn.jsdelivr.net/npm/rotom/dist/rotom.min.js)

### CDN

Use the appropriate bundle for your preferred implementation.

#### `omdomdom`

```html
<!-- Use the unminified bundle in development -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/rotom@0.6.5/dist/rotom.omdomdom.js"
  integrity="sha256-o5M70VzBttd90Qm7sslE0bEmTgkJx155EC+WX7XuIXM="
  crossorigin="anonymous"
></script>

<!-- Or use the minified/uglified bundle in production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/rotom@0.6.5/dist/rotom.omdomdom.min.js"
  integrity="sha256-Qeu676eS2QkVwOf1m8cPBwNaV2pavLjUfLVeNx7XcUY="
  crossorigin="anonymous"
></script>
```

#### `snabbdom`

```html
<!-- Use the unminified bundle in development -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/rotom@0.6.5/dist/rotom.snabbdom.js"
  integrity="sha256-o5M70VzBttd90Qm7sslE0bEmTgkJx155EC+WX7XuIXM="
  crossorigin="anonymous"
></script>

<!-- Or use the minified/uglified bundle in production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/rotom@0.6.5/dist/rotom.snabbdom.min.js"
  integrity="sha256-Qeu676eS2QkVwOf1m8cPBwNaV2pavLjUfLVeNx7XcUY="
  crossorigin="anonymous"
></script>
```

## Getting Started

So you're ready to take the dive? Awesome! Check out the wiki articles below on getting started. If you run into any problems or simply have ideas and suggestions, don't be shy about submitting an issue or pull request!

- [Getting started](https://github.com/geotrev/rotom/wiki/)
- [Add a view](https://github.com/geotrev/rotom/wiki/Add-a-view)
- [Add styles](https://github.com/geotrev/rotom/wiki/Add-styles)
- [Properties & state](https://github.com/geotrev/rotom/wiki/Properties-&-state)
- [Custom properties](https://github.com/geotrev/rotom/wiki/Custom-properties)
- [Lifecycle methods](https://github.com/geotrev/rotom/wiki/Lifecycle-methods)
- [DOM events](https://github.com/geotrev/rotom/wiki/DOM-events)
- [Internal methods](https://github.com/geotrev/rotom/wiki/Internal-methods)

## Browser Support

Rotom will work as-is in all major browsers, except IE11 and Opera Mini. The package contains no polyfills.

To polyfill the modern features, here are the necessary ones for at least IE11:

- [Symbols](https://github.com/zloirock/core-js) (import via npm as `core-js/features/symbol`)
- [Web Components](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)

## Performance

Performance is taken seriously. Under the hood is a blazing fast [string-based renderer](https://github.com/geotrev/omdomdom) with a predictable batched rendering mechanism.

## Contribute

If you like the project or find issues, feel free to contribute!
