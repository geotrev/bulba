<h2 align="center"><code><🔼>UpgradedElement<&#47;🔼></code></h2>
<br>
<p align="center">
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://img.shields.io/npm/v/upgraded-element.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://img.shields.io/npm/l/upgraded-element.svg?sanitize=true" alt="License"></a>
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://badgen.net/circleci/github/geotrev/upgraded-element/master" alt="Circle CI status (master)" /></a>
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://badgen.net/bundlephobia/minzip/upgraded-element" alt="bundle size" /></a>
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://badgen.net/david/dep/geotrev/upgraded-element" alt="dependencies" /></a>
  <a href="https://www.npmjs.com/package/upgraded-element"><img src="https://badgen.net/david/dev/geotrev/upgraded-element" alt="devDependencies" /></a>
</p>

UpgradedElement is a base class enabling modern component authoring techniques in custom elements.

Why should you use UpgradedElement?

1. Create dynamic, reactive components using modern web technology: Web Components!
2. Get all your favorite component authoring tools: state, properties, lifecycles.
3. It works in all modern browsers.

UpgradedElement extends the native web component functionality to provide more fine-tuned control over the element's lifecycle.

While it isn't absolutely required to know web components on a deep level, it wouldn't hurt to [read an overview](#using-custom-element-lifecycle-callbacks) to get the basics.

**🧾 Explore**

- 📥 [Install](#install)
- 🔎 [Getting Started](#getting-started)
- 🎮 [API](#api)
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
  src="https://cdn.jsdelivr.net/npm/upgraded-element@0.4.3/dist/upgraded-element.js"
  integrity="sha256-5fo/feskDBlZqMTUy8UbxR16Q/rUY3dcF7sYFmjoQxE="
  crossorigin="anonymous"
></script>

<!-- Or use the minified/uglified bundle in production -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/upgraded-element@0.4.3/dist/upgraded-element.min.js"
  integrity="sha256-M+QI2BA3OVos8+cu/I6VpedoCT2nH7Ik0B2C/r2Yf5c="
  crossorigin="anonymous"
></script>
```

## Getting Started

Creating a new element is easy. Once you've [installed](#install) the package, import and extend UpgradedElement, and then `register` the element.

Here's a quick example component to demonstrate:

```js
import { UpgradedElement, register } from "upgraded-element"

class FancyHeading extends UpgradedElement {
  static get styles() {
    return `
      :host {
        display: inline-block;
      }

      .is-fancy {
        font-family: Baskerville; 
        color: fuchsia; 
      }
    `
  }

  render() {
    return `
      <h2 class='is-fancy'>
        <slot></slot>
      </h2>
    `
  }
}

register("fancy-heading", FancyHeading)
```

That's it! Although the methods above (and much of the API) is custom, it's still just a hollow wrapper around the custom element API.

Import or link to your element file in your project or page, then use it:

```html
<div>
  <fancy-header>Am I fancy enough yet?</fancy-header>
  <p>I was fancy before everyone else.</p>
</div>
```

## API

The API is broken down in detail in this repo's wiki.

Jump to the section you need answers on:

- [Render a view]()
- [Add styles]()
- [Use DOM events]()
- [Use properties & state]()
- [Use custom properties]()
- [Use lifecycle methods]()
- [Advanced render controls]()

## Browser Support

This library doesn't include any polyfills.

If you need to polyfill, here are the features worth including:

- [Symbols](https://github.com/zloirock/core-js) (import via npm as `core-js/features/symbol`)
- [Web Components](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)

## Goals

- **Intuitive API.** Provide an easy way to create a styled view in a shadow root and access useful lifecycle methods for modern, state-based component design.

- **Consistent expectations.** The API is designed to provide sensible default use-cases. Escape hatches are still provided for advanced control.

- **No magic.** My hope is that this custom element wrapper Just Works™, and requires minimal effort to understand. That said, web components are fairly speculative despite being around for nearly a decade.

## Contribute

If you like the project or find issues, feel free to contribute!
