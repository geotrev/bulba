import { createDOMMap, diffDOM, stringToHTML, renderMapToDOM } from "./dom"
import {
  createUUID,
  toKebabCase,
  isEmptyObject,
  isString,
  isFunction,
  isUndefined,
  isSymbol,
} from "./utilities"
import { loadScheduler } from "./schedule"
import * as internal from "./internal"

export const register = (tag, Constructor) => {
  if (!customElements.get(tag)) {
    customElements.define(tag, Constructor)
  }
}

export class UpgradedComponent extends HTMLElement {
  constructor() {
    super()
    this[internal.initialize]()
  }

  // Public

  // Retrieve defined properties from the constructor instance
  // (ideally, not UpgradedComponent itself, but its constructor class)
  static get observedAttributes() {
    let attributes = []

    if (isEmptyObject(this.properties)) {
      return attributes
    }

    Object.keys(this.properties).forEach(property => {
      if (this.properties[property].reflected) attributes.push(toKebabCase(property))
    })

    return attributes
  }

  // Keep adoptedCallback around in case it becomes useful later.
  // Consumers will need to call super() to remain compatible, in the mean time.
  adoptedCallback() {}

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (isFunction(this.componentAttributeChanged) && oldValue !== newValue) {
      this.componentAttributeChanged(attribute, oldValue, newValue)
    }
  }

  connectedCallback() {
    if (this.isConnected) {
      if (isFunction(this.componentDidConnect)) {
        this.componentDidConnect()
      }

      this[internal.renderStyles]()
      this[internal.renderDOM]()
    }
  }

  disconnectedCallback() {
    if (isFunction(this.componentWillUnmount)) {
      this.componentWillUnmount()
    }

    // Clean up detached nodes and data.
    this[internal.domMap] = null
  }

  get componentId() {
    return this[internal.componentId]
  }

  requestRender() {
    window.scheduleComponentUpdate(this[internal.renderDOM])
  }

  validateType(property, value, type) {
    if (type === undefined || typeof value === type) return

    return console.warn(
      `Property '${property}' is invalid type of '${typeof value}'. Expected '${type}'. Check ${
        this.constructor.name
      }.`
    )
  }

  // Private

  [internal.initialize]() {
    // Append scheduler to the window
    loadScheduler()

    // Internal properties and metadata
    this[internal.renderDOM] = this[internal.renderDOM].bind(this)
    this[internal.firstRender] = true
    this[internal.domMap] = []
    this[internal.shadowRoot] = this.attachShadow({ mode: "open" })
    this[internal.componentId] = createUUID()

    this.setAttribute("component-id", this.componentId)
    this[internal.performUpgrade]()
  }

  [internal.performUpgrade]() {
    const { properties } = this.constructor
    if (isEmptyObject(properties)) return

    Object.keys(properties).forEach(property => {
      this[internal.createProperty](property, properties[property])
    })
  }

  [internal.createProperty](property, data = {}) {
    // If the constructor class is using its own setter/getter, bail
    if (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), property)) return

    const privateName = isSymbol(property) ? Symbol() : `__private_${property}__`
    const { default: defaultValue, type, reflected = false } = data

    // Validate the property's default value type, if given
    // Initialize the private property

    let initialValue = isFunction(defaultValue) ? defaultValue(this) : defaultValue
    if (!isUndefined(initialValue)) {
      if (type) this.validateType(property, initialValue, type)
      this[privateName] = initialValue
    }

    // Finally, declare its accessors

    Object.defineProperty(this, property, {
      configurable: true,
      enumerable: true,
      get() {
        return this[privateName]
      },
      set(value) {
        // Don't set if the value is the same to prevent unnecessary re-renders.
        if (value === this[privateName]) return
        if (type) this.validateType(property, value, type)

        const attribute = toKebabCase(property)
        const oldValue = this[privateName]

        if (value) {
          this[privateName] = value
          if (reflected) this.setAttribute(attribute, value)

          if (isFunction(this.componentPropertyChanged)) {
            this.componentPropertyChanged(property, oldValue, value)
          }
        } else {
          this[privateName] = undefined
          if (reflected) this.removeAttribute(attribute)

          if (isFunction(this.componentPropertyChanged)) {
            this.componentPropertyChanged(property, oldValue, null)
          }
        }

        window.scheduleComponentUpdate(this[internal.renderDOM])
      },
    })
  }

  [internal.getDOMString]() {
    let domString

    if (isFunction(this.render)) {
      domString = this.render()
    } else {
      throw new Error(`You must include a render method in component: ${this.constructor.name}`)
    }

    if (!isString(domString))
      throw new Error(
        `You attempted to render a non-string template in component: ${this.constructor.name}.`
      )

    return domString.trim()
  }

  [internal.renderStyles]() {
    if (!isString(this.constructor.styles)) return

    const { styles } = this.constructor
    const styleTag = document.createElement("style")
    styleTag.type = "text/css"
    styleTag.textContent = styles
    this[internal.shadowRoot].appendChild(styleTag)
  }

  [internal.renderDOM]() {
    if (!this[internal.firstRender]) {
      let templateMap = createDOMMap(stringToHTML(this[internal.getDOMString]()))
      diffDOM(templateMap, this[internal.domMap], this[internal.shadowRoot])
      templateMap = null
    } else {
      this[internal.domMap] = createDOMMap(stringToHTML(this[internal.getDOMString]()))
      renderMapToDOM(this[internal.domMap], this[internal.shadowRoot])
    }

    // Apply update lifecycle, if it exists
    if (!this[internal.firstRender] && isFunction(this.componentDidUpdate)) {
      this.componentDidUpdate()
    }

    // Apply mount lifecycle, if it exists
    if (this[internal.firstRender] && isFunction(this.componentDidMount)) {
      this.componentDidMount()
    }

    this[internal.firstRender] = false
  }
}
