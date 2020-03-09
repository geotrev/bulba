import { createDOMMap, diffDOM, stringToHTML, renderMapToDOM } from "./dom"
import {
  createUUID,
  toKebab,
  isPlainObject,
  isEmptyObject,
  isString,
  isFunction,
  isUndefined,
  isSymbol,
} from "./utilities"
import { loadScheduler } from "./schedule"
import * as internal from "./internal"

export class Rotom extends HTMLElement {
  constructor() {
    super()
    this[internal.initialize]()
  }

  // Public

  // Retrieve defined properties from the constructor instance
  // (ideally, not Rotom itself, but its extender)
  static get observedAttributes() {
    let attributes = []

    if (isEmptyObject(this.properties)) return []

    Object.keys(this.properties).forEach(property => {
      if (this.properties[property].reflected) attributes.push(toKebab(property))
    })

    return attributes
  }

  // Keep these around in case they become useful later.
  // Consumers will need to call super(), in the mean time.

  attributeChangedCallback() {}
  adoptedCallback() {}

  connectedCallback() {
    if (this.isConnected) {
      this[internal.renderStyles]()
      this[internal.renderDOM]()
    }
  }

  disconnectedCallback() {
    if (isFunction(this.componentWillUnmount)) {
      this.componentWillUnmount()
    }

    this[internal.domRoot] = null
    this[internal.domMap] = null
  }

  get componentId() {
    return this[internal.componentId]
  }

  requestRender() {
    window.rotomSchedule(this[internal.renderDOM])
  }

  // Private

  [internal.initialize]() {
    // Append scheduler to the window
    loadScheduler()

    // Internal properties and metadata
    this[internal.domRoot] = null
    this[internal.domMap] = []
    this[internal.shadowRoot] = this.attachShadow({ mode: "open" })
    this[internal.componentId] = createUUID()
    this.setAttribute("component-id", this.componentId)
    this[internal.renderDOM] = this[internal.renderDOM].bind(this)

    this[internal.performUpgrade]()
  }

  [internal.performUpgrade]() {
    const { properties } = this.constructor
    if (isEmptyObject(properties)) return

    Object.keys(properties).forEach(property => {
      this[internal.createProperty](property, properties[property])
    })
  }

  [internal.renderStyles]() {
    if (!isFunction(this.styles)) return
    const styles = this.styles()
    if (!isString(styles)) return

    const styleTag = document.createElement("style")
    styleTag.type = "text/css"
    styleTag.textContent = styles
    this[internal.shadowRoot].appendChild(styleTag)
  }

  [internal.renderDOM]() {
    // Consider re-mapping for each render. It takes <1ms to run the diff
    // - Unset domMap on each render
    // - Re-assign domMap before running diffDOM

    let firstRender

    if (this[internal.domRoot]) {
      let templateMap = createDOMMap(stringToHTML(this[internal.getDOMString]()))

      // TODO: If templateMap root node outerHTML equals domMap root node outerHTML, return
      diffDOM(templateMap, this[internal.domMap], this[internal.domRoot])
      templateMap = null
    } else {
      firstRender = true
      this[internal.domMap] = createDOMMap(stringToHTML(this[internal.getDOMString]()))
      // NOTE: This div is not appended to the shadow root. Only its children
      //       are attached. Alternatively, it might be more performant to remove
      //       the detached node and re-query the shadowRoot for all non-style
      //       tags and re-append to a new div element before diffing, above.
      this[internal.domRoot] = document.createElement("div")
      renderMapToDOM(this[internal.domMap], this[internal.shadowRoot])
    }

    if (!firstRender && isFunction(this.componentDidUpdate)) {
      this.componentDidUpdate()
    }

    if (firstRender && isFunction(this.componentDidMount)) {
      this.componentDidMount()
    }
  }

  [internal.createProperty](property, data = {}) {
    const privateName = isSymbol(property) ? Symbol(property) : `__${property}__`
    const { initialValue, type } = data
    const attribute = toKebab(property)
    const { properties } = this.constructor
    let isReflected

    // Get reflected properties. `observedAttributes` is not available yet, so
    // a similar check happens here.
    if (!isEmptyObject(properties)) {
      const entry = properties[property]
      if (isPlainObject(entry) && entry.reflected) {
        isReflected = true
      }
    }

    // Apply the internal property value before its getter/setter
    // is created. This is necessary because:
    // 1. Pre-setting prevents unnecessary re-renders.
    // 2. The value descriptor in `Object.defineProperty` can't be set along with accessors.
    if (!isUndefined(initialValue)) {
      this[internal.validateType](property, initialValue, type)
      this[privateName] = initialValue
    }

    Object.defineProperty(this, property, {
      configurable: true,
      enumerable: true,
      get() {
        return this[privateName]
      },
      set(value) {
        this[internal.validateType](property, value, type)

        if (value) {
          this[privateName] = value
          if (isReflected) this.setAttribute(attribute, value)
        } else {
          this[privateName] = undefined
          if (isReflected) this.removeAttribute(attribute)
        }

        window.rotomSchedule(this[internal.renderDOM])
      },
    })
  }

  [internal.validateType](property, value, type) {
    if (!type) return
    if (typeof value === type) return

    return console.warn(
      `Property '${property}' assigned unsupported type: '${typeof value}'. Expected '${type}'. Check ${
        this.constructor.name
      }.`
    )
  }

  [internal.getDOMString]() {
    let domString

    if (isFunction(this.render)) {
      domString = this.render()
    } else {
      throw new Error(
        `You must include a render method in your component. Component: ${this.constructor.name}`
      )
    }

    if (!isString(domString))
      throw new Error(
        `You attempted to render a non-string template. Check ${this.constructor.name}.render.`
      )

    return domString.trim()
  }
}
