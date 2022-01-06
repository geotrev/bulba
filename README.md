<h2 align="center">Rotom</h2>
<p align="center">Write intuitive, deterministic, and extendable web components.</p>
<br>
<p align="center">
  <a href="https://www.npmjs.com/package/rotom"><img src="https://img.shields.io/npm/v/rotom.svg?sanitize=true&style=flat-square" alt="Version"></a>
  <a href="https://www.npmjs.com/package/rotom"><img src="https://img.shields.io/npm/l/rotom.svg?sanitize=true&style=flat-square" alt="License"></a>
  <a href="https://www.npmjs.com/package/rotom"><img src="https://badgen.net/circleci/github/geotrev/rotom/master?style=flat-square" alt="Circle CI status (master)" /></a>
  <a href="https://www.npmjs.com/package/rotom"><img src="https://badgen.net/bundlephobia/minzip/rotom?style=flat-square" alt="bundle size" /></a>
  <a href="https://www.libraries.io/npm/rotom"><img src="https://img.shields.io/librariesio/release/npm/rotom" alt="dependency status" /></a>
</p>

**🧾 Explore**

- 🎮 [Getting Started](#getting-started)
  - [Install](#install)
  - [CDN](#cdn)
  - [Write with Template Strings](#write-with-template-strings)
  - [Write with JSX](#write-with-jsx)
  - [Type Checking and Debugging](#type-checking-and-debugging)
- 🌍 [Browser Support](#browser-support)
- 📈 [Performance](#performance)
- 🤝 [Contribute](#contribute)

## Getting Started

So you're ready to take the dive? Awesome! Check out the wiki articles below on getting started. If you run into any problems or simply have ideas and suggestions, don't be shy about submitting an issue or pull request!

- [Getting started](https://github.com/geotrev/rotom/wiki/)
- [Add a view](https://github.com/geotrev/rotom/wiki/Add-a-view)
- [Add styles](https://github.com/geotrev/rotom/wiki/Add-styles)
- [Properties & state](https://github.com/geotrev/rotom/wiki/Properties-&-state)
- [Custom properties](https://github.com/geotrev/rotom/wiki/Custom-properties)
- [Lifecycle methods](https://github.com/geotrev/rotom/wiki/Lifecycle-methods)
- [DOM events](https://github.com/geotrev/rotom/wiki/DOM-events)
- [Methods & utilities](https://github.com/geotrev/rotom/wiki/Methods-&-Utilities)

### Install

```sh
$ npm i rotom
```

### CDN

Use the CDN to skip packaging. Attaches to the window under `window.Rotom`.

_NOTE: Only template rendering is supported with the CDN._

```html
<!-- Peer dependency -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.3.0/dist/omdomdom.js"
  integrity="sha256-BpjOyF5QNlVmvIoAucFkb4hr+8+5r0qctp12U3J9cmM="
  crossorigin="anonymous"
></script>

<!-- The unminified bundle for development -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/rotom@0.9.1/dist/rotom.template.js"
  integrity="sha256-u6O9H0tr3290P9gRScPqi1ao+BqEmvXMBxU+1bFTeiQ="
  crossorigin="anonymous"
></script>

<!-- Minified/uglified bundle for production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/rotom@0.9.1/dist/rotom.template.min.js"
  integrity="sha256-K9tUzH/+qNAF3PNLZbGkCdivhRQwIWuq6nfKz1UvEfw="
  crossorigin="anonymous"
></script>
```

Note that omdomdom is a peer dependency of rotom (similar to `react-dom` for `react`). Make sure it is included on the page as shown above.

### Write with Template Strings

This is the default configuration and easiest way to use Rotom. It enables you to write HTML in your components as string templates.

First, install `omdomdom` as an additional dependency:

```sh
npm i omdomdom
```

Then write your component with HTML strings:

```js
import { RotomElement, register } from "rotom"

class FirstComponent extends RotomElement {
  render() {
    return `<p>What a cool component</p>`
  }
}

register("first-component", FirstComponent)
```

### Write with JSX

Using Rotom with JSX requires additional configuration.

In this mode, JSX is written with [`snabbdom`](https://github.com/snabbdom/snabbdom), so the below instructions follow [their recommendations](https://github.com/snabbdom/snabbdom#jsx) on setup.

First, install `snabbdom` as an additional dependency:

```sh
$ npm i snabbdom
```

When writing your component, ensure you specify `rotom/jsx` as the import path and import the jsx pragma:

```js
import { RotomElement, register } from "rotom/jsx"
import { jsx } from "snabbdom"

class FirstComponent extends RotomElement {
  render() {
    return (
      <p
        attrs={{ id: "foo" }}
        className="bar"
        on={{ mouseenter: (e) => console.log(e.target.innerText) }}
      >
        What a cool component
      </p>
    )
  }
}

register("first-component", FirstComponent)
```

Next, you're going to need some way of transforming the JSX at build time. The easiest way is transpiling your code with Babel using `@babel/plugin-transform-react-jsx` with Snabbdom's pragma.

Set up a `babel.config.json` like so (in addition to any plugins/presets you already have):

```json
{
  "plugins": [["@babel/plugin-transform-react-jsx", { "pragma": "jsx" }]]
}
```

Learn more about snabbdom's JSX API in the [modules section](https://github.com/snabbdom/snabbdom#modules-documentation) of their documentation.

### Type Checking and Debugging

The development (unminified) build of Rotom will include component property type checking. This feature is omitted in the production build.

## Browser Support

Rotom will work as-is in all major browsers, except IE11. The package contains no polyfills.

Use the below polyfills to achieve IE11 support. Include them once in your app (or page) before importing Rotom.

- [Symbols](https://github.com/zloirock/core-js) (import via npm as `core-js/features/symbol`)
- [Web Components](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)

## Performance

Performance is taken seriously. Both renderers use performant reconciliation algorithms to change content on a page.

However, as good as the performance is, it isn't perfect, so changes are always welcome!

## Contribute

If you like the project or find issues, feel free to contribute!

See [this SO answer](https://stackoverflow.com/a/63112599) on prerelease versioning.
