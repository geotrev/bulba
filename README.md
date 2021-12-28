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
  - [Write with Template Strings](#write-with-template-strings)
  - [Write with JSX](#write-with-jsx)
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
- [Internal methods](https://github.com/geotrev/rotom/wiki/Internal-methods)

### Install

```sh
$ npm i rotom
```

### Write with Template Strings

This is the default configuration and easiest way to use Rotom. It enables you to write HTML in your components as string templates.

Write your component:

```js
import { Rotom, register } from "rotom"

class FirstComponent extends Rotom {
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

When writing your component, ensure you specify `rotom/jsx` as the import path:

```js
import { Rotom, register } from "rotom/jsx"
// pragma to transform JSX into regular javascript
// you can declare this as a global in eslint to avoid no-unused errors
import { jsx } from "snabbdom"

class FirstComponent extends Rotom {
  render() {
    return (
      <p
        attrs={{ id: "foo" }}
        className="bar"
        on={{ mouseenter: handleMouseEnterFn }}
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
