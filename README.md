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

<p align="center"><a href="https://todo-rotom-jsx.netlify.app/"><big>See Rotom in action!</big></a></p>

**🧾 Explore**

- 🎮 [Getting Started](#getting-started)
  - [Install](#install)
    - [CDN](#cdn)
    - [Write with Template Strings](#write-with-template-strings)
    - [Write with JSX](#write-with-jsx)
  - [Default and Custom Renderer Versions](#default-and-custom-renderer-versions)
  - [Type Checking and Debugging](#type-checking-and-debugging)
- 🌍 [Browser Support](#browser-support)
- 📈 [Performance](#performance)
- 🤝 [Contribute](#contribute)

## Getting Started

So you're ready to take the dive? Awesome! Check out the wiki articles below on getting started. If you run into any problems or simply have ideas and suggestions, don't be shy about submitting an issue or pull request!

- [Getting started](https://github.com/geotrev/rotom/wiki/)
- [Create a view](https://github.com/geotrev/rotom/wiki/Views)
- [Add styles](https://github.com/geotrev/rotom/wiki/Styles)
- [Properties & state](https://github.com/geotrev/rotom/wiki/Properties-&-state)
- [Custom properties](https://github.com/geotrev/rotom/wiki/Custom-properties)
- [Lifecycle methods](https://github.com/geotrev/rotom/wiki/Lifecycle-methods)
- [DOM events](https://github.com/geotrev/rotom/wiki/DOM-events)
- [Methods & utilities](https://github.com/geotrev/rotom/wiki/Methods-&-Utilities)

### Install

```sh
$ npm i rotom
```

#### **CDN**

Use the CDN to skip packaging and use the library from the cloud.

First, include the renderer:

```html
<!-- Development build -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.3.0/dist/omdomdom.js"
  integrity="sha256-BpjOyF5QNlVmvIoAucFkb4hr+8+5r0qctp12U3J9cmM="
  crossorigin="anonymous"
></script>

<!-- OR production build-->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/omdomdom@0.3.0/dist/omdomdomm.min.js"
  integrity="sha256-BpjOyF5QNlVmvIoAucFkb4hr+8+5r0qctp12U3J9cmM="
  crossorigin="anonymous"
></script>
```

And Rotom itself (after the renderer script):

```html
<!-- Development build -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/rotom@0.9.1/dist/rotom.template.js"
  integrity="sha256-u6O9H0tr3290P9gRScPqi1ao+BqEmvXMBxU+1bFTeiQ="
  crossorigin="anonymous"
></script>

<!-- OR production build -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/rotom@0.9.1/dist/rotom.template.min.js"
  integrity="sha256-K9tUzH/+qNAF3PNLZbGkCdivhRQwIWuq6nfKz1UvEfw="
  crossorigin="anonymous"
></script>
```

- Note 1: that [Omdomdom](https://github.com/geotrev/omdomdom) is an peer dependency of Rotom in this use-case (similar to `react-dom` for `react`). Make sure it is included on the page, as shown above, _before_ Rotom is loaded.
- Note 2: You might need to configure your bundle to use Rotom on the page. Its global name is `'Rotom'` (bundlers will reference this globally from `window.Rotom`).

#### **Write with Template Strings**

This is the default configuration and easiest way to use Rotom. It enables you to write HTML in your components as string templates.

Write your component with HTML strings:

```js
import { RotomElement, register } from "rotom"

class FirstComponent extends RotomElement {
  constructor() {
    super()
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
  }

  onMount() {
    this.target = this.shadowRoot.querySelector("#foo")
    this.target.addEventListener("mouseenter", this.handleMouseEnter)
  }

  onUnmount() {
    this.target.removeEventListener("mouseenter", this.handleMouseEnter)
  }

  handleMouseEnter(e) {
    console.log(e.target.innerText)
  }

  render() {
    return "<p id="foo" class="bar">What a cool component!</p>"
  }
}

register("first-component", FirstComponent)
```

Learn more about [Omdomdom](https://github.com/geotrev/omdomdom).

#### **Write with JSX**

JSX is an industry standard for writing views, and it's fully supported in Rotom. [Snabbdom](https://github.com/snabbdom/snabbdom), a popular and performant JSX library, is used.

When importing from `rotom`, ensure you specify `rotom/jsx` as the import path and import the `jsx` pragma from `snabbdom` directly (you might need to whitelist `jsx` as an unused variable in linters):

```js
import { RotomElement, register } from "rotom/jsx"
import { jsx } from "snabbdom"

class FirstComponent extends RotomElement {
  render() {
    return (
      <p
        attrs={{ id: "foo", class: "bar" }}
        on={{ mouseenter: (e) => console.log(e.target.innerText) }}
      >
        What a cool component!
      </p>
    )
  }
}

register("first-component", FirstComponent)
```

Next, you're going to need some way of transforming the JSX at build time. The easiest way is transpiling your code with Babel using `@babel/plugin-transform-react-jsx` with Snabbdom's pragma.

Add the plugin to your `babel.config.json`. Example:

```json
{
  "plugins": [["@babel/plugin-transform-react-jsx", { "pragma": "jsx" }]]
}
```

Learn more about snabbdom's JSX API in the [modules section](https://github.com/snabbdom/snabbdom#modules-documentation) of their documentation.

### Default and Custom Renderer Versions

If you want to use a specific version of Omdomdom or Snabbdom, you can do so by explicitly installing it alongside Rotom. See Rotom's `optionalDependencies` field in its [`package.json` file](https://github.com/geotrev/rotom/blob/main/package.json#L35) for the default version you will get.

### Type Checking and Debugging

The development (unminified) build of Rotom will include component property type checking. This feature is omitted in the production build.

## Browser Support

The npm and browser bundles will work in all major browsers, except IE11. The package contains no explicit polyfills.

Use the below polyfills to achieve IE11 support. Include them once in your app (or page) before importing Rotom.

- [Symbols](https://github.com/zloirock/core-js) (import via npm as `core-js/features/symbol`)
- [Web Components](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)

You will also need to run the bundle through ES5 transpilation for things like arrow functions.

## Performance

Both the string and JSX libraries use performant reconciliation algorithms to change content on a page.

However, as good as the performance is, it isn't perfect, so changes are always welcome!

## Contribute

If you like the project or find issues, feel free to contribute!

See [this StackOverflow answer](https://stackoverflow.com/a/63112599) on prerelease versioning.
