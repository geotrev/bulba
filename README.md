<h2 align="center">Rotom</h2>
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
  - [Write with Template Strings](#write-with-template-strings)
  - [Write with JSX](#write-with-jsx)
- 🎮 [Getting Started](#getting-started)
- 🌍 [Browser Support](#browser-support)
- 📈 [Performance](#performance)
- 🤝 [Contribute](#contribute)

## Install

To get going, you have two html syntaxes to choose from when building Rotom elements: [String templates](#template-html) or [JSX](#jsx).

See the [Getting started](https://github.com/geotrev/rotom/wiki/) page to learn more about creating Rotom elements.

### Write with Template Strings

This is the default configuration and easiest way to start. It enables you to write HTML in your components as string templates.

Add the package:

```sh
$ npm i rotom-element
```

Set up a component:

```js
import { Rotom, register } from "rotom-element"

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

First, add these packages:

```sh
$ npm i rotom-element snabbdom
```

Then your component:

```js
import { Rotom, register } from "rotom-element/jsx"
// pragma to transform JSX into regular javascript
import { jsx } from "snabbdom"

class FirstComponent extends Rotom {
  render() {
    return (
      <p
        attrs={{ id: "foo" }}
        className="bar"
        on={{ mouseenter: this.handleMouseEnter }}
      >
        What a cool component
      </p>
    )
  }
}
register("first-component", FirstComponent)
```

> NOTE: Rotom may provide its own pragma in the future to improve the prop signature.

Next, you're going to need some way of transforming the JSX at build time.

The easiest way is transpiling your code with Babel using `@babel/plugin-transform-react-jsx` given `snabbdom`'s pragma.

Set up a `babel.config.json` like so (in addition to any plugins/presets you already have):

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "pragma": "jsx"
      }
    ]
  ]
}
```

Learn more about snabbdom's JSX API in the [modules section](https://github.com/snabbdom/snabbdom#modules-documentation) of their documentation.

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
