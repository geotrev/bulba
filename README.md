# \<upgraded-component\>

`UpgradedComponent` is an accessible base class bringing modern component authoring capabilities to native web components.

Features:
- Encapsulated HTML and styles in shadow root
- State management using upgraded properties
- Lifecycle methods (including the native callbacks)
- Zero dependencies

The package implements the same light-weight dynamic dom rendering mechanism used in [reef](https://github.com/cferdinandi/reef) (built by Chris Ferdinandi). The result is lightning fast render times (under a millisecond)! ⚡⚡⚡

🕹 **Table of Contents**

1. [Getting Started](#getting-started)
2. [Install](#install)
3. [API](#api)
   - [Render](#render)
   - [Styles](#styles)
   - [Properties](#properties)
     - [Configuration Options](#configuration-options)
     - [Managed Properties](#managed-properties)
   - [Lifecycle](#lifecycle)
     - [Methods](#methods)
     - [Using Native Lifecycle Callbacks](#using-native-lifecycle-callbacks)
   - [Internal Methods and Hooks](#internal-methods-and-hooks)
   - [DOM Events](#dom-events)
4. [Browser Support](#browser-support)
5. [Under the Hood](#under-the-hood)
   - [Technical Design](#technical-design)
   - [Rendering](#rendering)

## Getting Started

Creating a new component is easy. Once you've [installed](#install) the package, create your first component:

```js
// fancy-header.js

import { UpgradedComponent, register } from "./upgraded-component" // include `.js` for native modules

class FancyHeader extends UpgradedComponent {
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
$ npm i upgraded-component
```

```sh
$ yarn i upgraded-component
```

Then import the package and create your new component, per [Getting Started](#getting-started) above. 🎉

**Source**

[IIFE](https://cdn.jsdelivr.net/npm/upgraded-component/lib/upgraded-component.js) (browsers) / [ES Module](https://cdn.jsdelivr.net/npm/upgraded-component/lib/upgraded-component.esm.js) / [CommonJS](https://cdn.jsdelivr.net/npm/upgraded-component/lib/upgraded-component.cjs.js)

Import directly:

```js
// fancy-header.js

import { UpgradedComponent, register } from "./upgraded-component.js"
```

Then link to your script or module:

```html
<script type="module" defer src="path/to/fancy-header.js"></script>
```

## API

`UpgradedComponent` has its own API to more tightly control things like rendering encapsulated HTML and styles, tracking renders via custom lifecycle methods, and using built-in state via upgraded class properties.

Of course, it also extends `HTMLElement`, enabling native lifecycle callbacks for all extenders. Be sure to read about the caveats in [the native callbacks section](#using-native-lifecycle-callbacks) below.

### Render

Use the `render` method and return stringified HTML (it can also be a template string):

```js
render() {
  const details = { name: "Joey", location: "Nebraska" }
  return `Greetings from ${details.location}! My name is ${details.name}.`
}
```

### Styles

Use the static getter `styles` and return your stringified stylesheet:

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

Properties are integral to `UpgradedComponent`. By default, they behave as a function to your component's render state, similar to how state works in React.

Use the static getter `properties` and return an object, where each entry is the property name (key) and configuration (value). Property names should always be `camelCase`.

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

By default, all entries to `properties` will be upgraded with internal accessors, of which the setter will trigger a render, `componentPropertyChanged`, and `componentAttributeChanged` (if reflected). See [lifecycle](#lifecycle) methods below.

#### Configuration Options

The configuration is optional. Simply setting the property configuration to an empty object - `{}` - will be enough to upgrade it.

Enumerate the property with metadata to enable useful behaviors:

- `default` (string|function): Can be a primitive value, or callback which computes the final value. The callback receives the `this` of your component, or the HTML element itself. Useful for computing from attributes or other methods on your component (accessed via `this.constructor`).
- `type` (string): If given, compares with the [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) evaluation of the value. Default values are checked, too.
- `reflected` (boolean): Indicates if the property should reflect onto the host as an attribute. If `true`, the property name will reflect in kebab-case. E.g., `myProp` becomes `my-prop`.

#### Managed Properties

There's also the option to skip accessor upgrading if you decide you'd rather control that logic yourself. This is referred to as a 'managed' property.

Here's a quick example:

```js
static get properties() {
  return {
    // NOTE: This will be ignored!
    cardHeadingText: { type: "string", default: "Some default" }
  }
}

constructor() {
  super()

  // provide a default value for the internal property
  this._cardHeadingText = "My cool heading"
}

// Define accessors

set cardHeadingText(value) {
  if (!value || value === this.cardHeadingText) return

  this.validateType(value)

  const oldValue = this.cardHeadingText
  this._cardHeadingText = value

  this.componentPropertyChanged("cardHeadingText", oldValue, value)
  this.setAttribute("card-heading-text", value)
  this.requestRender()
}

get cardHeadingText() {
  return this._cardHeadingText
}
```

Worth noting is that setting your managed property via `properties` won't do anything so long as you've declared your own accessors, as indicated above.

Because the property is managed, you can optionally then tap into internal methods to re-create some or all of the logic included in upgraded properties. Note that `requestRender` is asynchronous. See [Internal Methods and Hooks](#internal-methods-and-hooks) below.

### Lifecycle

As mentioned previously, `UpgradedComponent` provides its own custom lifecycle methods, but also gives you the option to use the [native callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks) as well. There is [one caveat](#using-native-lifecycle-callbacks) to using the native callbacks, though.

The purpose of these is to add more developer fidelity to the existing callbacks as it pertains to the render/update lifecycle. See [using native lifecycle callbacks](#using-native-lifecycle-callbacks) for more details.

#### Methods

- `componentDidConnect`: Called at the beginning of `connectedCallback`, when the component has been attached to the DOM, but before the shadow root and component HTML/styles have been rendered. Ideal for initializing any internal properties or data that need to be ready before the first render.

- `componentDidMount`: Called at the end of `connectedCallback`, once the shadow root / DOM is ready. Ideal for registering DOM events or performing other DOM-sensitive actions.

- `componentDidUpdate`: Called on each render after `componentDidMount`. This includes: when an upgraded property has been set or `requestRender` was called.

- `componentPropertyChanged(name, oldValue, newValue)`: Called each time a property gets changed. Provides the property name (as a string), the old value, and the new value. If the old value matched the new value, this method is not triggered.

- `componentAttributeChanged(name, oldValue, newValue)`: Called by `attributeChangedCallback` each time an attribute is changed. If the old value matched the new value, this method is not triggered.

- `componentWillUnmount`: Called by `disconnectedCallback`, right before the internal DOM nodes have been cleaned up. Ideal for unregistering event listeners, timers, or the like.

**Q:** "Why does `UpgradedComponent` use lifecycle methods which seemingly duplicate the existing native callbacks?"

**A:** The primary purpose, as mentioned above, is adding more fidelity to the component render/update lifecycle in general. Another reason is for naming consistency and familiarity. As a developer who uses React extensively, I love the API and thought it made sense to mimic (in no subtle terms) the patterns established by the library authors.

#### Using Native Lifecycle Callbacks

`UpgradedComponent` piggybacks off the native lifecycle callbacks, which means if you use them, you should also call `super` to get the custom logic added by the base class. **This is especially true of `connectedCallback` and `disconnectedCallback`, which triggers the initial render of any given component and DOM cleanup steps, respectively.**

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

**Enabling transpiling & processing:** If you use a bundler like webpack, you'll need to flag this package as needing processing in your config. For example, you can update your `exclude` option in your script processing rule like so:

```js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!upgraded-component)/,
        loader: "babel-loader",
      },
    ],
  },
}
```

## Under the Hood

A few quick points on the design of `UpgradedComponent`:

### Technical Design

The goal of `UpgradedComponent` is not to add special features. Rather, it's goal is to enable you to use web components with the tools that already exist in the browser. This means: no decorators, no special syntax, and no magic. Those would be considered pluggable features akin to webpack-contrib.

### Rendering

Rendering for `UpgradedComponent` is a multi-step process.

1. **DOM:** Rendering is handled using a small virtual DOM (VDOM) implementation, almost identical to the one used in [reef](https://github.com/cferdinandi/reef). The main reasoning here is to reduce package size and make rendering cheap. Initial rendering typically takes a millisecond or less, with subsequent re-renders taking a fraction of that.

2. **Scheduling:** All renders, with the exception of first render, are asynchronously requested to happen at the next animation frame. This is accomplished using a combination of `postMessage` and `requestAnimationFrame`. Read more about those [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) and [here](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

**TODO:** Batching multiple property changes into a single render. Unfortunately, every single property change triggers a re-render. This isn't _horrible_ right now since re-renders are cheap, but it would improve performance in more complex cases.

---

If you like the project or find issues, feel free to contribute or open issues! <3
