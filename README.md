# <upgraded-component>

Use native web components with as little boilerplate as possible.

`UpgradedComponent` is an accessible base class for using native web components.

From string to HTML, it uses a virtual-dom implementation similar to what's in [reef](https://github.com/cferdinandi/reef) by Chris Ferdinandi. These means blazing fast rendering (a fraction of a millisecond)!

1. [Install](#install)
2. [Getting Started](#getting-started)
3. [API](#api)
   - [Styles](#styles)
   - [Properties](#properties)
     - [Generated](#generated)
     - [Managed](#managed)
   - [Lifecycle](#lifecycle)
   - [Methods](#methods)

## Install

You can install either by grabbing `lib/upgraded-component.js` (for browsers) or via npm.

**Source**

Put the file in your codebase somewhere and import it:

```html
<fancy-header>So cool!</fancy-header>
```

```js
// fancy-header.js

import { UpgradedComponent } from "./upgraded-component.js"

class FancyHeader extends UpgradedComponent {
  static get styles() {
    return ".is-fancy { font-family: Baskerville; color: fuchsia; }"
  }

  render() {
    return "<h1 class='is-fancy'><slot/></h1>"
  }
}
```

Then link to it:

```js
<script type="module" defer src="path/to/fancy-header.js"></script>
```

**NPM or Yarn**

Install it like you would any other package:

```sh
$ npm i upgraded-component
```

Then import it same as the above.

If you need IE11 support, you'll need to add polyfills. At the very least, `@babel/preset-env` and [`webcommponentsjs`](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)

## Getting Started

Creating a component is easy.

## API

`UpgradedComponent` has its own API to more tightly control things like rendering encapsulated HTML and styles, tracking renders via custom lifecycle methods, and using built-in state with class properties.

Of course, it also extends `HTMLElement`, enabling native lifecycle methods for all extenders, if you need that. Note that you should call `super` to continue receiving custom lifecycle events if you go that direction. For more details, see [properties](#properties) below.

### Render

In the case of creating HTML for your component, it will always be encapsulated within a `shadowRoot`. Create a method called `render` that returns stringified HTML (it can also be a template string):

```js
render() {
  const details = { name: "Joey", locatoin: "Nebraska" }
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

Properties are integral to `UpgradedComponent`. Think of them as a tool that informs your component's rendered state, similar to state in React.

To add properties, create a static getter called `properties` that returns an object, where each entry is the property name as the key, and the property configuration is the value:

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

By default, all entries to `properties` will be upgraded with custom-generated accessors, of which the setter will trigger re-renders, `componentPropertyChanged`, and `componentAttributeChanged` (if reflected). See [lifecycle](#lifecycle) methods below.

You can choose to override these default accessors by [managing them yourself](#managed-properties), too.

#### Property Configuration

A property entry to `properties` can have the following options:

- `type` (string): If given, compares to the [`typeof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) evaluation of the value. Default values are checked.
- `default` (string|function): Can be a primitive or callback which computes the final value. The callback receives the `this` of your component, or the HTML element itself. Useful for computing from attributes or other methods off your component's prototype.
- `reflected` (boolean): Indicates if the property should reflect onto the host. If `true`, the property key is reflected in kebab-case. E.g., `myProp` becomes `my-prop`.

### Managed Properties

### Lifecycle

### Methods and ID Property/Attribute

```js
// this.requestRender
// this.componentId
```

### Events

Since `render` only returns a plain string in most cases, you'll need to create any bind events in your component's `constructor`, then use `addEventListener` via `componentDidMount` to register them. Don't forget to use `removeEventListener` in `componentWillUnmount` as well.

```js
// example
```

## Under the Hood

### Requirements & Support

`UpgradedComponent` is designed to be as accessible as possible. To that end, its goal is to simply get out of the way and enable you to write custom elements with as few external dependencies as possible.

If you use `UpgradedComponent` out of the box, you get the support matrix as described on [`caniuse`](https://caniuse.com/#search=components). For everything else, you need a polyfill.

### Rendering

Rendering for the package is a multi-step process.

1. **DOM:** Rendering is handled using a small virtual DOM (VDOM) implementation, almost identical to the one used in [reef](https://github.com/cferdinandi/reef). The main reasoning here is to reduce package size and make rendering cheap. Initial rendering typically takes less than a millisecond, with subsequent re-renders in a fraction of a millisecond.

2. **Async:** All renders, with the exception of first render, are asynchronously requested to happen at the next animation frame. This is accomplished using a combination of `postMessage` and `requestAnimationFrame`. Read more about those [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) and [here](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

**TODO:** Batching multiple property changes into a single render. Unfortunately, every single property change triggers a re-render. This isn't _horrible_ right now since re-renders are cheap, but it would improve performance in more complex cases.

---

If you like the project or find issues, feel free to contribute or open issues! <3
