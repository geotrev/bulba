<h2 align="center">Rotom</h2>
<p align="center">Write intuitive, deterministic, and extendable web components.</p>
<br>
<p align="center">
  <a href="https://www.npmjs.com/package/rotom"><img src="https://img.shields.io/npm/v/rotom.svg?sanitize=true&style=flat-square" alt="Version"></a>
  <a href="https://github.com/geotrev/rotom/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/rotom.svg?sanitize=true&style=flat-square" alt="License"></a>
  <a href="https://github.com/geotrev/rotom/actions/workflows/test.yml?query=branch%3Amain"><img src="https://badgen.net/github/checks/geotrev/rotom/main?style=flat-square" alt="CI status" /></a>
  <a href="https://bundlephobia.com/package/rotom"><img src="https://badgen.net/bundlephobia/minzip/rotom?style=flat-square" alt="bundle size" /></a>
  <a href="https://www.libraries.io/npm/rotom"><img src="https://img.shields.io/librariesio/release/npm/rotom" alt="dependency status" /></a>
</p>

<p align="center"><a href="https://todo-rotom-jsx.netlify.app/"><big>See Rotom in action!</big></a></p>

**🧾 Explore**

- 🎮 [Getting Started](#getting-started)
  - [Install](#install)
  - [CDN](#cdn)
- 🌍 [Browser Support](#browser-support)
- 🤝 [Contribute](#contribute)

## Getting Started

So you're ready to take the dive? Awesome! Check out the wiki articles below on getting started. If you run into any problems or simply have ideas and suggestions, don't be shy about submitting an issue or pull request!

- [Getting started](https://github.com/geotrev/rotom/wiki/)
- [Create a view](https://github.com/geotrev/rotom/wiki/Views)
- [JSX Renderer](https://github.com/geotrev/rotom/wiki/JSX-Renderer)
- [Add styles](https://github.com/geotrev/rotom/wiki/Styles)
- [Properties & state](https://github.com/geotrev/rotom/wiki/Properties-&-state)
- [Custom properties](https://github.com/geotrev/rotom/wiki/Custom-properties)
- [Lifecycle methods](https://github.com/geotrev/rotom/wiki/Lifecycle-methods)
- [DOM events](https://github.com/geotrev/rotom/wiki/DOM-events)
- [Methods & utilities](https://github.com/geotrev/rotom/wiki/Methods-&-Utilities)

## Install

With NPM:

```sh
$ npm i @rotom/element
```

Rotom will include needed packages alongside it: `@rotom/utils`, `@rotom/jsx`, `@rotom/template`. You can optionally install them explicitly.

---

Using Rotom is then as simple as this for the Template flavor:

```jsx
import { RotomElement, register} from "@rotom/element"
import { Renderer } from "@rotom/template"

class MyComponent extends RotomElement(Renderer) { ... }
```

And for the JSX flavor:

```jsx
import { RotomElement, register} from "@rotom/element"
import { Renderer, jsx } from "@rotom/jsx"

class MyComponent extends RotomElement(Renderer) { ... }
```

Note that the `jsx` is the pragma for the internal JSX library, `snabbdom`, and should be included in any file with JSX.

Learn more about the Snabbdom JSX API in the [modules section](https://github.com/snabbdom/snabbdom#modules-documentation) of their documentation. Rotom uses a [syntax modifier](https://github.com/geotrev/snabbdom-transform-jsx-props) internally for JSX to enable a more user-friendly prop signature.

## CDN

You can specify the JSX or Template flavors using CDN. RotomElement, the renderer, and utilities will be bundled together in this scenario.

```html
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@rotom/utils@0.13.0-rc.0/dist/rotom-template.js"
  integrity="sha256-NOPDTZUvhuF3LtdAf1dsBhpzqP+zL3oRJMqmgSAU7tM="
  crossorigin="anonymous"
></script>
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@rotom/utils@0.13.0-rc.0/dist/rotom-template.min.js"
  integrity="sha256-JDd8b1tRpur+ISBUQXqyZgSI1wWgCZZSnD4Z2oiDjTA="
  crossorigin="anonymous"
></script>
```

```html
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@rotom/element@0.13.0-rc.0/dist/rotom-jsx.js"
  integrity="sha256-3UdUQviMqG6LV58JjAW0tSy+eeM2ym422hxtqTvpRNs="
  crossorigin="anonymous"
></script>
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@rotom/element@0.13.0-rc.0/dist/rotom-jsx.min.js"
  integrity="sha256-sQ9n1YiZd1ml+OWlhUqW2qTh0mGBvCkxoc/5GbJJvvc="
  crossorigin="anonymous"
></script>
```

Note that if you use the CDN bundles, you should set all `"@rotom/*"` package **external** names to `"Rotom"` in your app bundler of choice.

Here's a rollup example:

```js
{
  // ...
  external: ["@rotom/element", "@rotom/jsx", "@rotom/template", "@rotom/utils"]
  output: {
    // ...
    globals: {
      "@rotom/element": "Rotom",
      "@rotom/jsx": "Rotom", // or... @rotom/template
      "@rotom/utils": "Rotom",
    }
  }
}
```

## Browser Support

The npm and browser bundles will work in all major browsers, except IE11. The package contains no explicit polyfills.

Use the below polyfills to achieve IE11 support. Include them once in your app (or page) before importing Rotom.

- [Symbols](https://github.com/zloirock/core-js) (import via npm as `core-js/features/symbol`)
- [Web Components](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)

You will also need to run the bundle through ES5 transpilation for things like arrow functions.

## Contribute

If you like the project or find issues, feel free to contribute!

See [this StackOverflow answer](https://stackoverflow.com/a/63112599) on prerelease versioning.
