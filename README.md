# <🔼>UpgradedElement</🔼>

![CircleCI status (master)](https://badgen.net/circleci/github/geotrev/upgraded-element/master) ![minified + gzip size](https://badgen.net/bundlephobia/minzip/upgraded-element) ![npm version](https://badgen.net/npm/v/upgraded-element) ![dependencies](https://badgen.net/david/dep/geotrev/upgraded-element) ![devDependencies](https://badgen.net/david/dev/geotrev/upgraded-element)

`UpgradedElement` is a base class enabling modern component authoring techniques in custom elements.

Why would you use `UpgradedElement`, you ask?

1. Uses fragment-based rendering to keep rerenders concise.
2. Create [styles](#styles) and [view](#render) in a shadow root.
3. Manage state via [upgraded properties](#properties).
4. Use predictable and familiar [lifecycle methods](#lifecycle), plus [public methods](#internal-methods-and-hooks) for render-sensitive logic.

`UpgradedElement` uses a lightweight virtual DOM library called [OmDomDom](https://github.com/geotrev/omdomdom), a string-based renderer.

**🧾 Table of Contents**

- 📥 [Install](#install)
- 🔎 [Getting Started](#getting-started)
- 🎮 [API](#api)
  - [Render](#render)
  - [Styles](#styles)
  - [Properties](#properties)
    - [Configuration Options](#configuration-options)
    - [Custom Properties](#custom-properties)
    - [Updating a Property](#updating-a-property)
  - [Lifecycle](#lifecycle)
    - [Methods](#methods)
    - [Using Custom Element Lifecycle Callbacks](#using-custom-element-lifecycle-callbacks)
  - [Internal Methods and Hooks](#internal-methods-and-hooks)
    - [`requestRender`](#requestRender)
    - [`elementId`](#elementId)
    - [`validateType`](#validatetypepropertyname-value-type)
  - [DOM Events](#dom-events)
- 🌍 [Browser Support](#browser-support)
- 🏆 [Goals](#goals)
- 🤝 [Contribute](#contribute)

## Install

You can install either by grabbing the source file or with npm/yarn.

### NPM or Yarn

Install it like you would any other package:

```sh
$ npm i upgraded-element
```

```sh
$ yarn i upgraded-element
```

Then import the package and create your new element. See [Getting Started](#getting-started) on building your first element!

### Source

[ES Module](https://cdn.jsdelivr.net/npm/upgraded-element/lib/upgraded-element.esm.js) / [CommonJS Module](https://cdn.jsdelivr.net/npm/upgraded-element/lib/upgraded-element.cjs.js) / [Browser Bundle](https://cdn.jsdelivr.net/npm/upgraded-element/dist/upgraded-element.js) / [Browser Bundle (minified)](https://cdn.jsdelivr.net/npm/upgraded-element/dist/upgraded-element.min.js)

### CDN Links

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

Creating a new element is easy. Once you've [installed](#install) the package, import and extend `UpgradedElement`, and then `register` the element:

```js
import { UpgradedElement, register } from "upgraded-element"

class FancyHeader extends UpgradedElement {
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
      <h1 class='is-fancy'>
        <slot></slot>
      </h1>
    `
  }
}

register("fancy-header", FancyHeader)
```

**Note:** You can use all the expected features of web components here, including the `:host` CSS selector and slots (as shown above).

Import or link to your element file in your project or page, then use it:

```html
<div>
  <fancy-header>Am I fancy enough yet?</fancy-header>
  <p>I was fancy before everyone else.</p>
</div>
```

## API

`UpgradedElement` extends the native web component functionality to provide more fine-tuned control over the element's lifecycle.

While it isn't absolutely required to know them on a deep level, it wouldn't hurt to [read an overview](#using-custom-element-lifecycle-callbacks) to get the basics.

### Render

Use the `render` method and return stringified HTML (it can also be a template string):

```js
class MyCoolElement extends UpgradedElement {
  // ...

  render() {
    const details = { name: "Joey", location: "Nebraska" }
    return `Greetings from ${details.location}! My name is ${details.name}.`
  }
}
```

### Styles

Use the static `styles` getter and return your stringified stylesheet:

```js
class MyCoolElement extends UpgradedElement {
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

  // ...
}
```

### Properties

Properties are the internal state mechanism in an upgraded element. Defining a property will always hook it into the render lifecycle, similar to how state works in React.

Define your `properties` using the static getter. Each entry is the property name (key) and configuration (value). Property names should always be `camelCase`.

Example:

```js
class MyCoolElement extends UpgradedElement {
  static get properties() {
    return {
      propertyCount: {
        default: 2,
        type: "number",
        reflected: true,
      },
      countTag: {
        default: (this) => {
          const count = this.getAttribute("property-count")
          return `<div>There's ${count} properties</div>`
        },
        type: "string",
        safe: true,
      },
    }
  }

  // ...
}
```

#### Property Metadata

Configuration is optional. Simply setting the property configuration to an empty object - `{}` - will be enough to upgrade it.

A `property` can have the below additional configuration:

##### `default`

> Value type: String or Function

The default value for the property. It can be a primitive value, or callback which computes the final value. The callback receives the `this` of your element, aka the HTML element itself.

##### `type`

> Value type: String

Describes the data type for the property value. Default values are checked, too. All primitive values are accepted as a valid type. Object shape and enum support TBD. Here is a mostly-complete list of types:

- `string`
- `number`
- `symbol`
- `object`
- `array`
- `function`
- `boolean`
- `bigint`

##### `reflected`

> Value type: Boolean

Indicates if the property should reflect onto the host as an attribute. If `true`, the property name will reflect in kebab-case. E.g., `myProp` becomes `my-prop`.

##### `safe`

If you're using a string as the property value, this will tell `UpgradedElement` to sanitize it and replace unsafe special characters with [HTML-safe values](https://www.w3schools.com/html/html_entities.asp).

#### Updating a Property

A property in `UpgradedElement` is like any instance property on a JavaScript class. The difference is that it will be upgraded by default to hook into the render lifecycle.

Every time an upgraded property changes it will trigger the following steps (in order):

1. `elementAttributeChanged`, if reflected
2. `elementPropertyChanged`
3. Re-render to reflect the new property / attribute changes into the shadow root.
4. `elementDidUpdate`

See [lifecycle](#lifecycle) methods below.

#### Custom Properties

Since an UpgradedElement instance is still just an ES6 class, you can define your own properties if you want, too.

Here's a quick example for an `isOpen` property:

```js
class MyCoolElement extends UpgradedElement {
  static get properties() {
    return {
      // Hmm, what will this do?
      isOpen: {
        type: "boolean",
        default: false,
      },
    }
  }

  constructor() {
    super()

    // provide a default value for the internal property
    this._isOpen = false
  }

  // Define accessors:

  set isOpen(value) {
    if (value === this.isOpen) return
    this._isOpen = value
  }

  get isOpen() {
    return this._isOpen
  }

  // ...
}
```

**Tips:**

1. Adding a custom property into the `properties` object **won't do anything so long as you've declared your own accessors.**
2. Always name the internal property something different than the accessor methods that get/set its value. In other words, `isOpen` gets and sets the property `_isOpen`.
3. You can tap into the render lifecycle in your custom property's accessors, too!

**Custom Properties + Internal Methods**

To achieve the existing behavior of an upgraded property _without_ declaring one via the `properties` getter, you can add in upgraded-element's [internal methods](#internal-methods-and-hooks) to your custom property.

Using the previous `isOpen` example as a base, let's add some more logic to our setter:

```js
class MyCoolElement extends UpgradedElement {
  // ...

  set isOpen(value) {
    if (value === this.isOpen) return

    // Validate the type is correct
    this.validateType("isOpen", value, "boolean")

    // Get the old value before we set the new one
    const oldValue = this.isOpen
    this._isOpen = value

    // Reflect the property, if you want
    this.setAttribute("is-open", String(value))

    // Trigger the lifecycle callback
    this.elementPropertyChanged("isOpen", oldValue, value)

    // Update your view with the new state
    this.requestRender()
  }

  // ...
}
```

With that, you'll have created a custom workflow very similar to what comes out of the box with an upgraded property, but with your own prescriptions!

Note that `requestRender` is asynchronous. See [Internal Methods and Hooks](#internal-methods-and-hooks) below on how you can track render-state using `elementDidUpdate`.

### Lifecycle

As mentioned previously, `UpgradedElement` provides its own custom lifecycle methods, but also gives you the option to use the [built-in callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks) as well. There is [one caveat](#using-custom-element-lifecycle-callbacks) to using the native callbacks, though.

The purpose of these is to add more fidelity to the render lifecycle.

#### Methods

- `elementDidConnect`: Called at the beginning of `connectedCallback`, when the element has been attached to the DOM, but before the shadow root's HTML/styles have been rendered. Ideal for initializing any internal properties or data that need to be ready before the first render.

- `elementDidMount`: Called at the end of `connectedCallback`, once the shadow root / DOM is ready. Ideal for registering DOM events or performing other DOM-sensitive actions.

- `elementDidUpdate`: Called on each render after `elementDidMount`. This includes: when an upgraded property has been set or `requestRender` was called.

- `elementPropertyChanged(name, oldValue, newValue)`: Called each time a property gets changed. Provides the property name (as a string), the old value, and the new value. If the old value matches the new value, this method is not triggered. Create a [custom property](#custom-properties) to customize this behavior.

- `elementAttributeChanged(name, oldValue, newValue)`: Called each time an attribute is changed. If the old value matches the new value, this method is not triggered. Set `attributeChangedCallback` directly to customize this behavior.

- `elementWillUnmount`: Called by `disconnectedCallback`, right before the element's virtual DOM tree is cleaned up. Ideal for unregistering event listeners, timers, or the like.

#### Using Custom Element Lifecycle Callbacks

`UpgradedElement` piggybacks off the native lifecycle callbacks, which means if you use them, you should also call `super` to get the custom logic added by the base class. **This is especially true of `connectedCallback` and `disconnectedCallback`, which triggers the initial render and DOM cleanup steps, respectively.**

Here's a quick reference for which methods and features are dependent on the native callbacks:

- 🚨 `connectedCallback`: **`super` required**
  - Calls `elementDidConnect`
  - Calls `elementDidMount`
  - Also note if you override this method without super, no shadow root / styles / content will be rendered. :)
- 🏳 `attributeChangedCallback`: `super` optional
  - Calls `elementAttributeChanged`
- 🏳 `adoptedCallback` `super` recommended for future support
  - TBD, no methods called
- 🚨 `disconnectedCallback`: **`super` required**
  - Calls `elementWillUnmount`

### Internal Methods and Hooks

Because not all technical designs in the wild can service every use-case, here are some hooks to access the methods which handle renders, type checking, and the like.

#### `requestRender`

Manually schedules an asynchronous render.

To track the results of the manual render, you can set an internal property and check its value via `elementDidUpdate` like so:

```js
elementDidUpdate() {
  if (this._renderRequested) {
    // Set tracker to false to prevent unrelated renders
    // from reaching this block by accident
    this._renderRequested = false
    doSomeOtherStuff()
  }
}

someCallbackMethod() {
  this.doSomeStuff()

  // Set tracker just before render is called
  this._renderRequested = true
  this.requestRender()
}
```

#### `elementId`

This is an internal accessor that returns a unique identifier. E.g., `252u296xs51k7p6ph6v`.

You can access the id using the `element-id` attribute on the host.

#### `validateType(propertyName, value, type)`

The internal method which compares your property type. Useful if you are doing computations or other manipulations involving a reflected property.

**Use this method with caution for reflected properties.** You run the risk of an XSS attack. A future enhancement will provide a `sanitize` option which will ensure the value is safe.

### DOM Events

To add event listeners, it's like you would do in any ES6 class. First, bind the handler in your element's `constructor`.

```js
constructor() {
  this.handleClick = this.handleClick.bind(this)
}
```

Then you can register events using `addEventListener` in your `elementDidMount` lifecycle method, and likewise, deregister events using `removeEventListener` in your `elementWillUnmount` lifecycle.

```js
handleClick() {
  // bound handler
}

elementDidMount() {
  this.button = this.shadowRoot.querySelector(".my-button")
  this.button.addEventListener("click", this.handleClick)
}

elementWillUnmount() {
  this.button.removeEventListener("click", this.handleClick)
}
```

## Browser Support

`UpgradedElement` uses symbols, ES6 classes, and features within the web component standard. The decision to not polyfill is deliberate in order to get the performance boost of browsers, which by default, support these newer features. Custom bundles with polyfills will be made in the future.

In the mean time, to get support in IE11 and Edge classic, you will need to polyfill symbols and [web components](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs) (custom elements and shadow roots, specifically).

## Goals

- **Intuitive API.** Provide an easy way to create a styled view in a shadow root and access useful lifecycle methods for modern, state-based component design.

- **Consistent expectations.** The API is designed to provide sensible default use-cases. Escape hatches are still provided for advanced control.

- **No magic.** My hope is that this custom element wrapper Just Works™, and requires minimal effort to understand. That said, web components are fairly speculative despite being around for nearly a decade.

## Contribute

If you like the project or find issues, feel free to contribute!
