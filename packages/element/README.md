<h2 align="center">Bulba</h2>
<p align="center">Write intuitive, deterministic, and extendable web components.</p>
<br>
<p align="center">
  <a href="https://www.npmjs.com/package/@bulba%2Felement"><img src="https://img.shields.io/npm/v/@bulba%2Felement.svg?sanitize=true&style=flat-square" alt="Version"></a>
  <a href="https://github.com/geotrev/bulba/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@bulba%2Felement.svg?sanitize=true&style=flat-square" alt="License"></a>
  <a href="https://github.com/geotrev/bulba/actions/workflows/test.yml?query=branch%3Amain"><img src="https://badgen.net/github/checks/geotrev/bulba/main?style=flat-square" alt="CI status" /></a>
  <a href="https://bundlephobia.com/package/@bulba%2Felement"><img src="https://badgen.net/bundlephobia/minzip/@bulba%2Felement?style=flat-square" alt="bundle size" /></a>
  <a href="https://www.libraries.io/npm/@bulba%2Felement"><img src="https://img.shields.io/librariesio/release/npm/@bulba%2Felement" alt="dependency status" /></a>
</p>

<p align="center"><a href="https://todo-bulba-jsx.netlify.app/"><big>See Bulba in action!</big></a></p>

**🧾 Explore**

- 🎮 [Getting Started](#getting-started)
  - [Install](#install)
  - [CDN](#cdn)
- 🌍 [Browser Support](#browser-support)
- 🤝 [Contribute](#contribute)

## Getting Started

So you're ready to take the dive? Awesome! Check out the wiki articles below on getting started. If you run into any problems or simply have ideas and suggestions, don't be shy about submitting an issue or pull request!

- [Getting started](https://github.com/geotrev/bulba/wiki/)
- [Create a view](https://github.com/geotrev/bulba/wiki/Views)
- [JSX Renderer](https://github.com/geotrev/bulba/wiki/JSX-Renderer)
- [Add styles](https://github.com/geotrev/bulba/wiki/Styles)
- [Properties & state](https://github.com/geotrev/bulba/wiki/Properties-&-state)
- [Custom properties](https://github.com/geotrev/bulba/wiki/Custom-properties)
- [Lifecycle methods](https://github.com/geotrev/bulba/wiki/Lifecycle-methods)
- [DOM events](https://github.com/geotrev/bulba/wiki/DOM-events)
- [Methods & utilities](https://github.com/geotrev/bulba/wiki/Methods-&-Utilities)

## Install

With NPM:

```sh
$ npm i @bulba/element
```

Bulba will include needed packages alongside itself: `@bulba/utils`, `@bulba/jsx`, `@bulba/template`.

---

Using Bulba is then as simple as this for the Template flavor:

```jsx
import { BulbaElement, register} from "@bulba/element"
import { Renderer } from "@bulba/template"

class MyComponent extends BulbaElement(Renderer) { ... }
```

And for the JSX flavor:

```jsx
import { BulbaElement, register} from "@bulba/element"
import { Renderer, jsx, Fragment } from "@bulba/jsx"

class MyComponent extends BulbaElement(Renderer) { ... }
```

Note that the `jsx` and `Fragment` are pragmas for the internal JSX library, `snabbdom`, and should be included in any file with JSX. You'll also need to [configure your environment](https://github.com/snabbdom/snabbdom#jsx) to transform JSX.

Learn more about the Snabbdom JSX API in the [modules section](https://github.com/snabbdom/snabbdom#modules-documentation) of their documentation. Bulba uses a [syntax modifier](https://github.com/geotrev/snabbdom-transform-jsx-props) internally for JSX to enable a more user-friendly prop signature.

## CDN

You can specify the JSX or Template flavors using CDN. BulbaElement, the renderer, and utilities will be bundled together in this scenario.

```html
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@bulba/utils@0.13.0-alpha.7/dist/bulba-template.js"
  integrity="sha256-dzF067k9kE7x9R8RgQB99krIFIf2P5xkHT6HOmJY84o="
  crossorigin="anonymous"
></script>
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@bulba/utils@0.13.0-alpha.7/dist/bulba-template.min.js"
  integrity="sha256-cDlX+PbUk05TvWm/setAxPFxrOL/feFJkAbzVysplVs="
  crossorigin="anonymous"
></script>
```

```html
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@bulba/element@0.13.0-alpha.7/dist/bulba-jsx.js"
  integrity="sha256-vnymyHSoSQAThIncCLp7RTymaQ/ZEFYno4c14xOtP4U="
  crossorigin="anonymous"
></script>
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@bulba/element@0.13.0-alpha.7/dist/bulba-jsx.min.js"
  integrity="sha256-RWQYs8/tayY+C3iL2KgS8vMMObc5hZBxyw4+qNRMqx8="
  crossorigin="anonymous"
></script>
```

Note that if you use the CDN bundles, you should set all `"@bulba/*"` package **external** names to `"Bulba"` in your app bundler of choice.

Here's a rollup example:

```js
const globals = {
  "@bulba/element": "Bulba",
  "@bulba/jsx": "Bulba",
  "@bulba/template": "Bulba",
  "@bulba/utils": "Bulba",
}

// export config
export default {
  // ...
  external: Object.keys(globals),
  output: {
    // ...,
    globals,
  },
}
```

## Browser Support

The npm and browser bundles will work in all major browsers, except IE11. The package contains no explicit polyfills.

Use the below polyfills to achieve IE11 support. Include them once in your app (or page) before importing Bulba.

- [Symbols](https://github.com/zloirock/core-js) (import via npm as `core-js/features/symbol`)
- [Web Components](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)

You will also need to run the bundle through ES5 transpilation for things like arrow functions.

## Contribute

If you like the project or find issues, feel free to contribute!

See [this StackOverflow answer](https://stackoverflow.com/a/63112599) on prerelease versioning.
