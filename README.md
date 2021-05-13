<h2 align="center"><code><🔼>UpgradedElement<&#47;🔼></code></h2>
<p align="center">A base class enabling modern architecture strategies in Web Components.</p>
<br>
<p align="center">
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://img.shields.io/npm/v/upgraded-element.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://img.shields.io/npm/l/upgraded-element.svg?sanitize=true" alt="License"></a>
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://badgen.net/circleci/github/geotrev/upgraded-element/master" alt="Circle CI status (master)" /></a>
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://badgen.net/bundlephobia/minzip/upgraded-element" alt="bundle size" /></a>
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://badgen.net/david/dep/geotrev/upgraded-element" alt="dependencies" /></a>
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://badgen.net/david/dev/geotrev/upgraded-element" alt="devDependencies" /></a>
</p>

UpgradedElement provides huge power in a small package. It's intuitive, deterministic, and easily extendable.

Performance is taken seriously. Under the hood is a blazing fast [string-based renderer](https://github.com/geotrev/omdomdom) with a predictable batched rendering mechanism.

**🧾 Explore**

- 📥 [Install](#install)
- 🎮 [Getting Started](#getting-started)
- 🌍 [Browser Support](#browser-support)
- 🤝 [Contribute](#contribute)

## Install

You can use UpgradedElement through one of three ways.

### NPM or Yarn

```sh
$ npm i upgraded-element
```

or

```sh
$ yarn i upgraded-element
```

### Raw Files

[ES Module](https://cdn.jsdelivr.net/npm/upgraded-element/lib/upgraded-element.esm.js) / [CommonJS Module](https://cdn.jsdelivr.net/npm/upgraded-element/lib/upgraded-element.cjs.js) / [Browser Bundle](https://cdn.jsdelivr.net/npm/upgraded-element/dist/upgraded-element.js) / [Browser Bundle (minified)](https://cdn.jsdelivr.net/npm/upgraded-element/dist/upgraded-element.min.js)

### CDN

```html
<!-- Use the unminified bundle in development -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/upgraded-element@0.6.0/dist/upgraded-element.js"
  integrity="sha256-H4HeZcialyI4kLsDQDb52BBlRQ9KWWZmAAQfjPC/r84="
  crossorigin="anonymous"
></script>

<!-- Or use the minified/uglified bundle in production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/upgraded-element@0.6.0/dist/upgraded-element.min.js"
  integrity="sha256-GEFPc2tsrDFgDYBkf+rBIMhS+y7ypKvaEICpXklGtmA="
  crossorigin="anonymous"
></script>
```

## Getting Started

So you're ready to take the dive? Awesome! Check out the wiki articles below on getting started. If you run into any problems or simply have ideas and suggestions, don't be shy about submitting an issue or pull request!

- [Getting started](https://github.com/geotrev/upgraded-element/wiki/)
- [Add a view](https://github.com/geotrev/upgraded-element/wiki/Add-a-view)
- [Add styles](https://github.com/geotrev/upgraded-element/wiki/Add-styles)
- [Properties & state](https://github.com/geotrev/upgraded-element/wiki/Properties-&-state)
- [Custom properties](https://github.com/geotrev/upgraded-element/wiki/Custom-properties)
- [Lifecycle methods](https://github.com/geotrev/upgraded-element/wiki/Lifecycle-methods)
- [DOM events](https://github.com/geotrev/upgraded-element/wiki/DOM-events)
- [Internal methods](https://github.com/geotrev/upgraded-element/wiki/Internal-methods)

## Browser Support

UpgradedElement will work as-is in all major browsers, except IE11 and Opera Mini. The package won't include any polyfills on its own.

If you need to polyfill, here are the features worth including:

- [Symbols](https://github.com/zloirock/core-js) (import via npm as `core-js/features/symbol`)
- [Web Components](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)

## Contribute

If you like the project or find issues, feel free to contribute!
