# \<upgraded-element\>

`UpgradedElement` is an accessible base class bringing modern component authoring capabilities to custom elements. There are no dependencies.

It extends `HTMLElement` to give you [native component callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks), but with the added benefits of:

1. Automatically encapsulating styles/HTML in a shadow root
2. Providing state management via [upgraded properties](#properties)
3. Predictable lifecycle methods

The package implements the same light-weight DOM mapping engine used in [reef](https://github.com/cferdinandi/reef) (built by Chris Ferdinandi). The result is dynamic DOM patching and lightning fast render times (under a millisecond)! ⚡⚡⚡

**Table of Contents**

- 🎢 [Getting Started](#getting-started)
- 📥 [Install](#install)
- 🎮 [API](#api)
  - [Render](#render)
  - [Styles](#styles)
  - [Properties](#properties)
    - [Configuration Options](#configuration-options)
    - [Managed Properties](#managed-properties)
    - [Updating a Property](#updating-a-property)
  - [Lifecycle](#lifecycle)
    - [Methods](#methods)
    - [Using Native Lifecycle Callbacks](#using-native-lifecycle-callbacks)
  - [Internal Methods and Hooks](#internal-methods-and-hooks)
  - [DOM Events](#dom-events)
- 🌍 [Browser Support](#browser-support)
- 🔎 [Under the Hood](#under-the-hood)
  - [Technical Design](#technical-design)
  - [Rendering](#rendering)

## Getting Started

Creating a new component is easy. Once you've [installed](#install) the package, extend `UpgradedElement`:

```js
// fancy-header.js

import { UpgradedElement, register } from "./upgraded-element" // include `.js` for native modules

class FancyHeader extends UpgradedElement {
  static get styles() {
    return `
      .is-fancy {
        font-family: Baskerville; 
        color: fuchsia; 
      }
    `
  }

  render() {
    return `<h1 class='is-fancy'><slot></slot></h1>`
  }
}

// No need to export anything as custom elements aren't modules.

register("fancy-header", FancyHeader)
```

**Tip:** You can use all the features of web components here, including the `:host` CSS selector and slots (as shown above)!

Import or link to your component file, then use it:

```html
<fancy-header>Do you like my style?</fancy-header>
```

You can even use it in React:

```js
import React from "react"
import "./fancy-header"

const SiteBanner = props => (
  <div class="site-banner">
    <img src={props.src} alt="banner" />
    <fancy-header>{props.heading}</fancy-header>
  </div>
)
```

## Install

You can install either by grabbing the source file or with npm/yarn.

**NPM or Yarn**

Install it like you would any other package:

```sh
$ npm i upgraded-element
```

```sh
$ yarn i upgraded-element
```

Then import the package and create your new component, per [Getting Started](#getting-started) above. 🎉

**Source**

[IIFE](https://cdn.jsdelivr.net/npm/upgraded-element/lib/upgraded-element.js) (browsers) / [ES Module](https://cdn.jsdelivr.net/npm/upgraded-element/lib/upgraded-element.esm.js) / [CommonJS](https://cdn.jsdelivr.net/npm/upgraded-element/lib/upgraded-element.cjs.js)

Import directly:

```js
// fancy-header.js

import { UpgradedElement, register } from "./upgraded-element.js"
```

Then link to your script or module:

```html
<script type="module" defer src="path/to/fancy-header.js"></script>
```

## API

`UpgradedElement` has its own API to more tightly control things like rendering encapsulated HTML and styles, tracking renders via custom lifecycle methods, and using built-in state via upgraded class properties.

As mentioned in the beginning, the class extends `HTMLElement`, enabling access to native lifecycle callbacks. Be sure to read [the native callbacks section](#using-native-lifecycle-callbacks) first, as functionality piggy backs off of a few in particular.

### Render

Use the `render` method and return stringified HTML (it can also be a template string):

```js
render() {
  const details = { name: "Joey", location: "Nebraska" }
  return `Greetings from ${details.location}! My name is ${details.name}.`
}
```

### Styles

Use the static `styles` getter and return your stringified stylesheet:

```js
static get styles() {
  return `
    :host {
      display: block;
    }

    .fancy-element {
      font-family: Comic Sans MS;
    }
  `
}
```

### Properties

**TL;DR** Properties enable internal state in `UpgradedElement`. By defining a property, it will be upgraded to hook into the render lifecycle, similar to how state works in React.

Use the static `properties` getter and return an object, where each entry is the property name (key) and configuration (value). Property names should always be `camelCase`.

Example:

```js
static get properties() {
  return {
    myFavoriteNumber: {
      default: 12,
      type: "number",
    },
    myOtherCoolProp: {
      default: (element) => element.getAttribute("some-attribute"),
      type: "string",
      reflected: true,
    }
  }
}
```

#### Configuration Options

Configuration is optional. Simply setting the property configuration to an empty object - `{}` - will be enough to upgrade it.

Here are the properties accepted in the configuration object:

- `default` (string|function): Can be a primitive value, or callback which computes the final value. The callback receives the `this` of your component, or the HTML element itself. Useful for computing from attributes or other methods on your component (accessed via `this.constructor`).
- `type` (string): If given, compares with the [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) evaluation of the value. Default values are checked, too.
- `reflected` (boolean): Indicates if the property should reflect onto the host as an attribute. If `true`, the property name will reflect in kebab-case. E.g., `myProp` becomes `my-prop`.

#### Updating a Property

A property in `UpgradedElement` is like any instance property on a JavaScript class. The difference is that it will be upgraded by default to hook into the render lifecycle.

Every time an upgraded property changes it will trigger the following steps (in order):

1. `componentAttributeChanged` lifecycle (if reflected; see [configuration options](#configuration-options) below)
2. `componentPropertyChanged` lifecycle
3. Re-render to reflect the new property / attribute changes into the shadow root.

See [lifecycle](#lifecycle) methods below.

#### Managed Properties

There's also the option to skip accessor upgrading if you prefer to implement more custom functionality. This is referred to as a 'managed' property.

Here's a quick example for an `isOpen` property:

```js
static get properties() {
  return {
    // Hmm, what will this do?
    isOpen: { type: "string", default: false }
  }
}

constructor() {
  super()

  // provide a default value for the internal property
  this._isOpen = false
}

// Define accessors

set isOpen(value) {
  // No reason to update if the new value is already the current value
  if (!value || value === this.isOpen) return

  this.validateType(value)

  const oldValue = this.isOpen
  this._isOpen = value
}

get isOpen() {
  return this._isOpen
}
```

Worth noting is that setting your managed property via `properties` **won't do anything so long as you've declared your own accessors.**

**Q:** "What if I want to hook into the lifecycle hooks?"

**A:** You can do that too. Tap into internal methods to re-create some or all of the logic included in an upgraded property.

Using the previous example of `isOpen`, we'll add the following to the end of the setter:

```js
this.setAttribute("card-heading-text", value)
this.componentPropertyChanged("isOpen", oldValue, value)
this.requestRender()
```

Note that `requestRender` is asynchronous. See [Internal Methods and Hooks](#internal-methods-and-hooks) below on how you can track it using `componentDidUpdate`.

### Lifecycle

As mentioned previously, `UpgradedElement` provides its own custom lifecycle methods, but also gives you the option to use the [native callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks) as well. There is [one caveat](#using-native-lifecycle-callbacks) to using the native callbacks, though.

The purpose of these is to add more developer fidelity to the existing callbacks as it pertains to the render/update lifecycle. See [using native lifecycle callbacks](#using-native-lifecycle-callbacks) for more details.

#### Methods

- `componentDidConnect`: Called at the beginning of `connectedCallback`, when the component has been attached to the DOM, but before the shadow root and component HTML/styles have been rendered. Ideal for initializing any internal properties or data that need to be ready before the first render.

- `componentDidMount`: Called at the end of `connectedCallback`, once the shadow root / DOM is ready. Ideal for registering DOM events or performing other DOM-sensitive actions.

- `componentDidUpdate`: Called on each render after `componentDidMount`. This includes: when an upgraded property has been set or `requestRender` was called.

- `componentPropertyChanged(name, oldValue, newValue)`: Called each time a property gets changed. Provides the property name (as a string), the old value, and the new value. If the old value matched the new value, this method is not triggered.

- `componentAttributeChanged(name, oldValue, newValue)`: Called by `attributeChangedCallback` each time an attribute is changed. If the old value matched the new value, this method is not triggered.

- `componentWillUnmount`: Called by `disconnectedCallback`, right before the internal DOM nodes have been cleaned up. Ideal for unregistering event listeners, timers, or the like.

**Q:** "Why does `UpgradedElement` use lifecycle methods which seemingly duplicate the existing native callbacks?"

**A:** The primary purpose, as mentioned above, is adding more fidelity to the component render/update lifecycle in general. Another reason is for naming consistency and familiarity. As a developer who uses React extensively, I love the API and thought it made sense to mimic (in no subtle terms) the patterns established by the library authors.

#### Using Native Lifecycle Callbacks

`UpgradedElement` piggybacks off the native lifecycle callbacks, which means if you use them, you should also call `super` to get the custom logic added by the base class. **This is especially true of `connectedCallback` and `disconnectedCallback`, which triggers the initial render of any given component and DOM cleanup steps, respectively.**

Here's a quick reference for which lifecycle methods are dependent on the native callbacks:

- 🚨 `connectedCallback`: **`super` required**
  - Calls `componentDidConnect`
  - Calls `componentDidMount`
- 🏳 `attributeChangedCallback`
  - Calls `componentAttributeChanged`
- 🏳 `adoptedCallback`
  - TBD, no methods called.
- 🚨 `disconnectedCallback`: **`super` required**
  - Calls `componentWillUnmount`

Calling `super` is a safe bet to maintain backwards compatibility, including the yet-to-be-integrated `adoptedCallback`. 🙂

### Internal Methods and Hooks

Because of the escape hatches that exist with managed properties and native lifecycle callbacks, it's necessary to provide hooks to access the methods which handle renders, type checking, and the like.

#### `requestRender`

Manually schedules a render. Note that it will be asynchronous.

If you need to track the result of your manual `requestRender` call, you can set an internal property and checking its value via `componentDidUpdate` like so:

```js
componentDidUpdate() {
  if (this._renderRequested) {
    this._renderRequested = false
    doSomeOtherStuff()
  }
}

someCallbackMethod() {
  this.doSomeStuff()
  this._renderRequested = true
  this.requestRender()
}
```

#### `componentId`

This is an internal accessor that returns a unique identifier. E.g., `252u296xs51k7p6ph6v`.

#### `validateType(value)`

The internal method which compares your property type. If you have a managed property that is reflected to the host, it's possible that the attribute can be set from the outside too. You can use this to validate the computed result (e.g., `parseInt` on the value, if you expect the type to be a `"number"`).

### DOM Events

To add event listeners, it's like you would do in any ES6 class. First, bind the callback in your component's `constructor`.

```js
constructor() {
  this.handleClick = this.handleClick.bind(this)
}
```

Then you can register events using `addEventListener` in your `componentDidMount` lifecycle method, and likewise, deregister events using `removeEventListener` in your `componentWillUnmount` lifecycle.

```js
handleClick() {
  // bound handler
}

componentDidMount() {
  this.button = this.shadowRoot.querySelector(".my-button")
  this.button.addEventListener("click", this.handleClick)
}

componentWillUnmount() {
  this.button.removeEventListener("click", this.handleClick)
}
```

## Browser Support

This package uses symbols, template strings, ES6 classes, and of course, the various pieces of the web component standard. The decision to not polyfill or transpile is deliberate in order to get the performance boost of browsers which support these newer features.

To get support in IE11, you will need some combination of Babel polyfill, `@babel/preset-env`, and [`webcommponentsjs`](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs). For more details on support, check out the [caniuse](https://caniuse.com/#search=components) article which breaks down the separate features that make up the web component standard.

**Transpiling & processing:** If you use a bundler like webpack, you'll need to flag this package as needing processing in your config. For example, you can update your `exclude` option in your script processing rule like so:

```js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!upgraded-element)/,
        loader: "babel-loader",
      },
    ],
  },
}
```

## Under the Hood

A few quick points on the design of `UpgradedElement`:

### Technical Design

The goal of `UpgradedElement` is not to add special features. Rather, it's goal is to enable you to use web components with the tools that already exist in the browser. This means: no decorators, no special syntax, and no magic. Those would be considered pluggable features akin to webpack-contrib.

### Rendering

Rendering for `UpgradedElement` is a multi-step process.

1. **DOM:** Rendering is handled using a small virtual DOM (VDOM) implementation, almost identical to the one used in [reef](https://github.com/cferdinandi/reef). The main reasoning here is to reduce package size and make rendering cheap. Initial rendering typically takes a millisecond or less, with subsequent re-renders taking a fraction of that.

2. **Scheduling:** All renders, with the exception of first render, are asynchronously requested to happen at the next animation frame. This is accomplished using a combination of `postMessage` and `requestAnimationFrame`. Read more about those [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) and [here](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

**TODO:** Batching multiple property changes into a single render. Unfortunately, every single property change triggers a re-render. This isn't _horrible_ right now since re-renders are cheap, but it would improve performance in more complex cases.

---

If you like the project or find issues, feel free to contribute or open issues! <3
