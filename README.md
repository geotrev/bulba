# <upgraded-component>

Use native web components with as little boilerplate as possible.

`UpgradedComponent` is an accessible base class for using native web components.

From string to HTML, it uses a virtual-dom implementation similar to what's in [reef](https://github.com/cferdinandi/reef) by Chris Ferdinandi. These means blazing fast rendering (a fraction of a millisecond)!

1. [Install](#install)
2. [Getting Started](#getting-started)
3. [API](#api)

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

## API

### Properties

### Styles

### Lifecycle
