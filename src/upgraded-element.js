import { createVDOM, stringToHTML, diffVDOM, renderToDOM } from "./reef-dom"
import {
  createUUID,
  toKebabCase,
  isEmptyObject,
  isString,
  isFunction,
  isUndefined,
  isSymbol,
  getTypeTag,
} from "./utilities"
import { getScheduler } from "./scheduler"
import * as internal from "./internal"
import * as external from "./external"

/**
 * @module UpgradedElement
 * @extends HTMLElement
 */
export class UpgradedElement extends HTMLElement {
  constructor() {
    super()
    this[internal.initialize]()
  }

  // Public

  // Retrieve defined properties from the extender.
  static get observedAttributes() {
    let attributes = []

    if (!isEmptyObject(this.properties)) {
      Object.keys(this.properties).forEach(property => {
        if (this.properties[property].reflected) attributes.push(toKebabCase(property))
      })
    }

    return attributes
  }

  // Keep adoptedCallback around in case it becomes useful later.
  // Consumers will need to call super() to remain compatible, in the mean time.
  adoptedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[internal.runLifecycle](external.elementAttributeChanged, name, oldValue, newValue)
    }
  }

  connectedCallback() {
    if (this.isConnected) {
      this[internal.runLifecycle](external.elementDidConnect)
      this[internal.renderStyles]()
      this[external.requestRender]()
    }
  }

  disconnectedCallback() {
    this[internal.runLifecycle](external.elementWillUnmount)

    // Clean up detached nodes and data.
    this[internal.vDOM] = null
  }

  /**
   * Returns the internal element id.
   */
  get [external.elementIdProperty]() {
    return this[internal.elementId]
  }

  /**
   * Schedules a new render.
   */
  [external.requestRender]() {
    this[internal.schedule](this[internal.renderDOM])
  }

  /**
   * Validates a property's value.
   * @param {string} property
   * @param {string} value
   * @param {string} type
   */
  [external.validateType](property, value, type) {
    const evaluatedType = getTypeTag(value)
    if (type === undefined || evaluatedType === type) return

    console.warn(
      `Property '${property}' is invalid type of '${evaluatedType}'. Expected '${type}'. Check ${this.constructor.name}.`
    )
  }

  // Private

  /**
   * Triggers a lifecycle method of the specified `name` with `args`, if given.
   */
  [internal.runLifecycle](name, ...args) {
    if (isFunction(this[name])) {
      this[name](...args)
    }
  }

  /**
   * Do initial setup work, then upgrade.
   */
  [internal.initialize]() {
    // Append scheduler to the window
    this[internal.schedule] = getScheduler()

    // Internal properties and metadata
    this[internal.renderDOM] = this[internal.renderDOM].bind(this)
    this[internal.isFirstRender] = true
    this[internal.vDOM] = []
    this[internal.shadowRoot] = this.attachShadow({ mode: "open" })
    this[internal.elementId] = createUUID()

    this.setAttribute(external.elementIdAttribute, this[external.elementIdProperty])
    this[internal.performUpgrade]()
  }

  /**
   * Upgrade properties detected in the extender.
   */
  [internal.performUpgrade]() {
    const { properties } = this.constructor
    if (isEmptyObject(properties)) return

    Object.keys(properties).forEach(property => {
      this[internal.upgradeProperty](property, properties[property])
    })
  }

  /**
   * Upgrade a property based on its configuration. If accessors are detected in
   * the extender, skip the upgrade.
   * @param {String} property - name of the upgraded property.
   * @param {{value, default, reflected}} configuration - property definition of the extender.
   */
  [internal.upgradeProperty](property, configuration = {}) {
    // If the constructor class is using its own setter/getter, bail
    if (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), property)) return

    const privateName = isSymbol(property) ? Symbol() : `__private_${property}__`
    const { default: defaultValue, type, reflected = false } = configuration

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

      /**
       * Set a new value:
       * - If the value is the same as before, exit
       * - Validate the type
       * - If elementPropertyChanged is defined, call it
       * - If reflected, call setAttribute
       * - Request a new render.
       */
      set(value) {
        // Don't set if the value is the same to prevent unnecessary re-renders.
        if (value === this[privateName]) return
        if (type) this.validateType(property, value, type)

        const attribute = toKebabCase(property)
        const oldValue = this[privateName]

        if (value) {
          this[privateName] = value
          this[internal.runLifecycle](external.elementPropertyChanged, property, oldValue, value)
          if (reflected) this.setAttribute(attribute, value)
        } else {
          this[privateName] = undefined
          this[internal.runLifecycle](external.elementPropertyChanged, property, oldValue, value)
          if (reflected) this.removeAttribute(attribute)
        }

        this[external.requestRender]()
      },
    })
  }

  /**
   * Retrieves the dom string from the extender.
   * @returns {String} - Stringified HTML from the extender's render method.
   */
  [internal.getDOMString]() {
    let domString

    if (isFunction(this.render)) {
      domString = this.render()
    } else {
      throw new Error(`You must include a render method in component: '${this.constructor.name}'`)
    }

    if (!isString(domString)) {
      throw new Error(
        `You attempted to render a non-string template in component: '${this.constructor.name}'.`
      )
    }

    return domString
  }

  [internal.getVDOM]() {
    return createVDOM(stringToHTML(this[internal.getDOMString]()))
  }

  /**
   * Creates the style tag and appends styles as detected in the extender.
   */
  [internal.renderStyles]() {
    if (!isString(this.constructor.styles)) return

    const { styles } = this.constructor
    const styleTag = document.createElement("style")
    styleTag.type = "text/css"
    styleTag.textContent = styles
    this[internal.shadowRoot].appendChild(styleTag)
  }

  /**
   * For first render:
   * Create a virtual DOM from the external `render` method and patch
   * it into the shadow root. Triggers `elementDidMount`, if defined.
   */
  [internal.getInitialRenderState]() {
    this[internal.vDOM] = this[internal.getVDOM]()
    renderToDOM(this[internal.vDOM], this[internal.shadowRoot])
    this[internal.runLifecycle](external.elementDidMount)
    this[internal.isFirstRender] = false
  }

  /**
   * All renders after initial render:
   * Create a new virtual DOM and diff it against the existing virtual DOM.
   */
  [internal.getNextRenderState]() {
    let nextVDOM = this[internal.getVDOM]()
    diffVDOM(nextVDOM, this[internal.vDOM], this[internal.shadowRoot])
    nextVDOM = null
    this[internal.runLifecycle](external.elementDidUpdate)
  }

  /**
   * Runs either a new render or diffs the existing virtual DOM to a new one.
   */
  [internal.renderDOM]() {
    if (this[internal.isFirstRender]) {
      return this[internal.getInitialRenderState]()
    }

    this[internal.getNextRenderState]()
  }
}
