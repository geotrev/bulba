# \<upgraded-component\>

`UpgradedComponent` is a simple and accessible base class enabling intuitive use of web components with no dependencies.

The class brings various features to make your components predictable and maintainable. Encapsulate your HTML and styles in a shadow root, manage state using properties, tap into lifecycle methods, and more.

Additionally, `UpgradedComponent` implements the same light-weight virtual dom used in [reef](https://github.com/cferdinandi/reef), built by Chris Ferdinandi. The result is DOM rendering in lightning fast render times (under a millisecond)! ⚡⚡⚡

🕹 **Table of Contents**

1. [Getting Started](#getting-started)
2. [Install](#install)
3. [API](#api)
   - [Render](#render)
   - [Styles](#styles)
   - [Properties](#properties)
     - [Configuration]()
     - [Managed Properties](#managed-properties)
   - [Lifecycle](#lifecycle)
     - [Methods](#methods)
     - [Using Native Lifecycle Callbacks](#using-native-lifecycle-callbacks)
   - [Static Properties and Hooks](#static-properties-and-hooks)
   - [DOM Events](#dom-events)
4. [Browser Support](#browser-support)
5. [Under the Hood](#under-the-hood)
   - [Requirements](#requirements)
   - [Rendering](#rendering)

## Getting Started

Creating a new component is easy. Once you've [installed](#install) the package, create your first component:

```js
// fancy-header.js

import { UpgradedComponent } from "./upgraded-component" // include `.js` for native modules

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

const TAG_NAME = "fancy-header"
if (!customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, FancyHeader)
}
```

Import the file and use your new element. You can even use it in React:

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

... or in plain ol' HTML:

```html
<fancy-header>Do you like my style?</fancy-header>
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

Then import and create your new component, per [Getting Started](#getting-started) above.

**Source**

[IIFE](https://cdn.jsdelivr.net/npm/upgraded-component/lib/upgraded-component.js) (browsers) / [ES Module](https://cdn.jsdelivr.net/npm/upgraded-component/lib/upgraded-component.esm.js) / [CommonJS](https://cdn.jsdelivr.net/npm/upgraded-component/lib/upgraded-component.cjs.js)

Import directly:

```js
import { UpgradedComponent } from "./upgraded-component.js"
```

Then link to your script/module:

```html
<script type="module" defer src="path/to/fancy-header.js"></script>
```

## API

`UpgradedComponent` has its own API to more tightly control things like rendering encapsulated HTML and styles, tracking renders via custom lifecycle methods, and using built-in state via upgraded class properties.

Of course, it also extends `HTMLElement`, enabling native lifecycle callbacks for all extenders, if you need that. Note that you should call `super` to continue receiving custom lifecycle events if you go that direction. For more details, see [Lifecycle methods](#lifecycle) below.

### Render

In the case of creating HTML for your component, it will always be encapsulated within a `shadowRoot`. Create a method called `render` that returns stringified HTML (it can also be a template string):

```js
render() {
  const details = { name: "Joey", location: "Nebraska" }
  return `Greetings from ${details.location}! My name is ${details.name}.`
}
```

### Styles

Similar to above, to add encapsulated styles, all you need to do is create a static getter called `styles` that returns your stringified stylesheet:

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

Properties are integral to `UpgradedComponent`. Think of them as informants to your component's render state, similar to how state works in React.

To add properties, create a static getter called `properties` that returns an object, where each entry is the property name (key) and configuration (value). Property names should always be `camelCase`.

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

Each option in the configuration is optional. Simply setting the property configuration to an empty object - `{}` - will be enough to upgrade it.

- `default` (string|function): Can be a primitive value, or callback which computes the final value. The callback receives the `this` of your component, or the HTML element itself. Useful for computing from attributes or other methods on your component (accessed via `this.constructor`).
- `type` (string): If given, compares with the [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) evaluation of the value. Default values are checked, too.
- `reflected` (boolean): Indicates if the property should reflect onto the host as an attribute. If `true`, the property name will reflect in kebab-case. E.g., `myProp` becomes `my-prop`.

By default, all entries to `properties` will be upgraded with internal accessors, of which the setter will trigger a render, `componentPropertyChanged`, and `componentAttributeChanged` (if reflected). See [lifecycle](#lifecycle) methods below.

#### Managed Properties

There's also the option to skip accessor upgrading if you decide you'd rather control that logic yourself. This is referred to as a 'managed' property in this guide.

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
  this._cardHeadingText = "My cool heading"
}

set cardHeadingText(value) {
  if (!value || value === this.cardHeadingText) return

  this.validateType(value)

  const oldValue = this._cardHeadingText
  this._cardHeadingText = value

  this.componentPropertyChanged("_cardHeadingText", oldValue, value)
  this.setAttribute("card-heading-text", value)
  this.requestRender()
}

get cardHeadingText() {
  return this._cardHeadingText
}
```

Worth noting is that setting your managed property via `properties` won't do anything so long as you've declared your own accessors, as indicated above.

As shown above, you can tap into the lifecycle methods too, including when and how they are called. Note that `requestRender` is asynchronous.

### Lifecycle

As mentioned previously, `UpgradedComponent` provides its own custom lifecycle methods, but also gives you the option to use the [native callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks) as well. There is [one caveat](#using-native-lifecycle-callbacks) to using the native callbacks, though.

The purpose of these is to add more developer fidelity to the existing callbacks as it pertains to the render/update lifecycle. See [using native lifecycle callbacks](#using-native-lifecycle-callbacks) for more details.

#### Methods

- `componentDidConnect`: Called at the beginning of `connectedCallback`, when the component has been attached to the DOM, but before the shadow root and component HTML/styles have been rendered. Ideal for initializing any internal properties or data that need to be ready before the first render.

- `componentDidMount`: Called at the end of `connectedCallback`, once the shadow root / DOM is ready. Ideal for registering DOM events or performing other DOM-sensitive actions.

- `componentDidUpdate`: Called on each render after `componentDidMount`. This includes: when an upgraded property has been set or `requestRender` was called.

- `componentPropertyChanged(name, oldValue, newValue)`: Called each time a property gets changed. Provides the property name (as a string), the old value, and the new value. If the old value matched the new value, this method is not triggered.

- `componentAttributeChanged(name, oldValue, newValue)`: Called by `attributeChangedCallback` each time an attribute is changed. If the old value matched the new value, this method is not triggered.

- `componentWillDisconnect`: Called by `disconnectedCallback`, right before the internal DOM nodes have been cleaned up. Ideal for unregistering event listeners, timers, or the like.

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
  - Doesn't call a method.
- 🚨 `disconnectedCallback`: **`super` required**
  - Calls `componentWillUnmount`

All that having been said, calling `super` is a safe bet to maintain backwards compatibility, including the yet-to-be-integrated `adoptedCallback`. 🙂

### Static Properties and Hooks

<!-- TBD -->

```js
// this.requestRender
// this.componentId
```

### DOM Events

Like binding events in any ES6 class, you should do so in your component's `constructor`. Then you can register events using `addEventListener` in your `componentDidMount` lifecycle method, and likewise, deregister events using `removeEventListener` in your `componentWillUnmount` lifecycle.

```js
// example
```

## Browser Support

If you need IE11 support, you'll need to add polyfills. This package uses symbols, template strings, and of course, ES6 classes. Babel polyfill, preset-env, and [`webcommponentsjs`](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs) should get you all the way across the finish line.

## Under the Hood

A few quick points on the design of `UpgradedComponent`:

### Requirements

If you use `UpgradedComponent` out of the box, you get the support matrix as described on [caniuse](https://caniuse.com/#search=components) for web components. For everything else, you need to transpile/polyfill. See [Support](#browser-support) for more information.

`UpgradedComponent` is designed to be as accessible as possible. To that end, its goal is to simply get out of the way and enable you to write custom elements with as few external dependencies as possible.

### Rendering

Rendering for `UpgradedComponent` is a multi-step process.

1. **DOM:** Rendering is handled using a small virtual DOM (VDOM) implementation, almost identical to the one used in [reef](https://github.com/cferdinandi/reef). The main reasoning here is to reduce package size and make rendering cheap. Initial rendering typically takes a millisecond or less, with subsequent re-renders taking a fraction of that.

2. **Scheduling:** All renders, with the exception of first render, are asynchronously requested to happen at the next animation frame. This is accomplished using a combination of `postMessage` and `requestAnimationFrame`. Read more about those [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) and [here](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

**TODO:** Batching multiple property changes into a single render. Unfortunately, every single property change triggers a re-render. This isn't _horrible_ right now since re-renders are cheap, but it would improve performance in more complex cases.

---

If you like the project or find issues, feel free to contribute or open issues! <3
