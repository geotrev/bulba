import { createDOMMap, stringToHTML, diffDOM, renderToDOM } from "./reef-dom"
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
import { loadScheduler } from "./schedule"
import * as internal from "./internal"
import * as external from "./external"

/**
 * Adds custom element to the global registry.
 * @param {string} tag
 * @param {module} UpgradedInstance
 */
export const register = (tag, UpgradedInstance) => {
  if (!customElements.get(tag)) {
    customElements.define(tag, UpgradedInstance)
  }
}

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

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (isFunction(this[external.elementAttributeChanged]) && oldValue !== newValue) {
      this[external.elementAttributeChanged](attribute, oldValue, newValue)
    }
  }

  connectedCallback() {
    if (this.isConnected) {
      if (isFunction(this[external.elementDidConnect])) {
        this[external.elementDidConnect]()
      }

      this[internal.renderStyles]()
      this[external.requestRender]()
    }
  }

  disconnectedCallback() {
    if (isFunction(this[external.elementWillUnmount])) {
      this[external.elementWillUnmount]()
    }

    // Clean up detached nodes and data.
    this[internal.domMap] = null
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
    window.scheduleComponentUpdate(this[internal.renderDOM])
  }

  /**
   * Validates a property's value.
   * @param {string} propertyName
   * @param {string} value
   * @param {string} type
   */
  [external.validateType](propertyName, value, type) {
    const evaluatedType = getTypeTag(value)
    if (type === undefined || evaluatedType === type) return

    console.warn(
      `Property '${propertyName}' is invalid type of '${evaluatedType}'. Expected '${type}'. Check ${this.constructor.name}.`
    )
  }

  // Private

  /**
   * Do initial setup work, then upgrade.
   */
  [internal.initialize]() {
    // Append scheduler to the window
    loadScheduler()

    // Internal properties and metadata
    this[internal.renderDOM] = this[internal.renderDOM].bind(this)
    this[internal.isFirstRender] = true
    this[internal.domMap] = []
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
      this[internal.createProperty](property, properties[property])
    })
  }

  /**
   * Upgrade a property based on its configuration. If accessors are detected in
   * the extender, skip the upgrade.
   */
  [internal.createProperty](property, configuration = {}) {
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
       * - If the value is the same as before, exit early
       * - Validate the type if requested.
       * - If reflected, call setAttribute
       * - If elementPropertyChanged is defined, call it
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
          if (reflected) this.setAttribute(attribute, value)

          if (isFunction(this[external.elementPropertyChanged])) {
            this[external.elementPropertyChanged](property, oldValue, value)
          }
        } else {
          this[privateName] = undefined
          if (reflected) this.removeAttribute(attribute)

          if (isFunction(this[external.elementPropertyChanged])) {
            this[external.elementPropertyChanged](property, oldValue, null)
          }
        }

        this[external.requestRender]()
      },
    })
  }

  /**
   * Retrieves the dom string from the extender.
   */
  [internal.getDOMString]() {
    let domString

    if (isFunction(this.render)) {
      domString = this.render()
    } else {
      throw new Error(`You must include a render method in component: ${this.constructor.name}`)
    }

    if (!isString(domString)) {
      throw new Error(
        `You attempted to render a non-string template in component: ${this.constructor.name}.`
      )
    }

    return domString
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
   * First render:
   *
   * Creates a virtual DOM from the extending `render` and patches
   * it into the shadow root. Triggers `elementDidMount` if defined.
   */
  [internal.getInitialRenderState]() {
    this[internal.domMap] = createDOMMap(stringToHTML(this[internal.getDOMString]()))
    renderToDOM(this[internal.domMap], this[internal.shadowRoot])

    if (isFunction(this[external.elementDidMount])) {
      this[external.elementDidMount]()
    }

    this[internal.isFirstRender] = false
  }

  /**
   * All subsequent renders:
   *
   * Create a new virtual DOM and diff it against the existing virtual DOM.
   */
  [internal.getNextRenderState]() {
    let templateMap = createDOMMap(stringToHTML(this[internal.getDOMString]()))
    diffDOM(templateMap, this[internal.domMap], this[internal.shadowRoot])
    templateMap = null

    if (isFunction(this[external.elementDidUpdate])) {
      this[external.elementDidUpdate]()
    }
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
