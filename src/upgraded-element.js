import { create, update, render } from "omdomdom"
import { getScheduler } from "./renderer/scheduler"
import * as internal from "./internal"
import * as external from "./external"
import {
  isEmptyObject,
  isString,
  isFunction,
  isUndefined,
  getTypeTag,
  toKebabCase,
  createUUID,
  sanitizeString,
} from "./utilities"

/**
 * @module UpgradedElement
 * @extends HTMLElement
 */
export class UpgradedElement extends HTMLElement {
  constructor() {
    super()
    this[internal.initialize]()
  }

  // Retrieve defined properties from the extender.
  static get observedAttributes() {
    if (isEmptyObject(this.properties)) return []

    let attributes = []

    for (let propName in this.properties) {
      if (!this.properties[propName].reflected) continue
      attributes.push(toKebabCase(propName))
    }

    return attributes
  }

  // Keep adoptedCallback around in case it becomes useful later.
  // Consumers will need to call super() to remain compatible, in the mean time.
  adoptedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[internal.runLifecycle](
        external.elementAttributeChanged,
        name,
        oldValue,
        newValue
      )
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

  // Public

  /**
   * Returns the internal element id.
   * @returns {string}
   */
  get [external.elementIdProperty]() {
    return this[internal.elementId]
  }

  /**
   * Requests a new render at the next animation frame.
   * Will batch subsequent renders if they are requested
   * before the previous frame has completed (0-16/17 milliseconds)
   */
  [external.requestRender]() {
    this[internal.schedule](this[internal.renderDOM])
  }

  /**
   * Validates a property's value.
   * @param {string} propName
   * @param {string} value
   * @param {string} type
   */
  [external.validateType](propName, value, type) {
    const evaluatedType = getTypeTag(value)
    if (type === undefined || evaluatedType === type) return

    // eslint-disable-next-line no-console
    console.warn(
      `[UpgradedElement]: Property '${propName}' is invalid type of '${evaluatedType}'. Expected '${type}'. Check ${this.constructor.name}.`
    )
  }

  // Private

  /**
   * Triggers a lifecycle method of the specified `name` with `args`, if given.
   * @param {string} name - name of the lifecycle method
   * @param {arguments} args - args to pass along to the method, if any
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

    // Set id as an attribute
    this.setAttribute(
      external.elementIdAttribute,
      this[external.elementIdProperty]
    )

    // Set document direction for reflow support in shadow roots
    this.setAttribute("dir", String(document.dir || "ltr"))

    this[internal.performUpgrade]()
  }

  /**
   * Upgrade properties detected in the extender.
   */
  [internal.performUpgrade]() {
    const { properties } = this.constructor

    if (isEmptyObject(properties)) return

    for (let propName in properties) {
      this[internal.upgradeProperty](propName, properties[propName])
    }
  }

  /**
   * Upgrade a property based on its configuration. If accessors are detected in
   * the extender, skip the upgrade.
   * @param {string} propName
   * @param {{value, default, reflected}} configuration
   */
  [internal.upgradeProperty](propName, configuration = {}) {
    // If the constructor class is using its own setter/getter, bail
    if (
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), propName)
    ) {
      return
    }

    const privateName = Symbol(propName)
    const {
      default: defaultValue,
      type,
      reflected = false,
      safe = false,
    } = configuration

    let initializedValue = isFunction(defaultValue)
      ? defaultValue(this)
      : defaultValue

    // Validate the property's default value type, if given
    // Initialize the private property

    if (!isUndefined(initializedValue)) {
      if (type) {
        this[external.validateType](propName, initializedValue, type)
      }

      if (safe && (type === "string" || typeof initializedValue === "string")) {
        initializedValue = sanitizeString(initializedValue)
      }

      this[privateName] = initializedValue
    }

    // If the value is reflected, set its attribute.

    if (reflected) {
      const initialAttrValue = initializedValue ? String(initializedValue) : ""
      const attribute = toKebabCase(propName)
      this.setAttribute(attribute, initialAttrValue)
    }

    // Finally, declare its accessors

    Object.defineProperty(this, propName, {
      configurable: true,
      enumerable: true,
      get() {
        return this[privateName]
      },
      set(value) {
        // Don't set if the value is the same to prevent unnecessary re-renders.
        if (value === this[privateName]) return
        if (type) this[external.validateType](propName, value, type)

        const oldValue = this[privateName]

        if (!isUndefined(value)) {
          this[privateName] =
            safe && (type === "string" || typeof value === "string")
              ? sanitizeString(value)
              : value

          this[internal.runLifecycle](
            external.elementPropertyChanged,
            propName,
            oldValue,
            value
          )

          if (reflected) {
            const attribute = toKebabCase(propName)
            const attrValue = String(value)
            this.setAttribute(attribute, attrValue)
          }
        } else {
          delete this[privateName]

          this[internal.runLifecycle](
            external.elementPropertyChanged,
            propName,
            oldValue,
            value
          )

          if (reflected) {
            const attribute = toKebabCase(propName)
            this.removeAttribute(attribute)
          }
        }

        this[external.requestRender]()
      },
    })
  }

  /**
   * Retrieves the dom string from the extender.
   * @returns {string} - Stringified HTML from the extender's render method.
   */
  [internal.getDOMString]() {
    let domString

    if (isFunction(this.render)) {
      domString = this.render()
    } else {
      throw new Error(
        `You must include a render method in element: '${this.constructor.name}'`
      )
    }

    if (!isString(domString)) {
      throw new Error(
        `You attempted to render a non-string template in element: '${this.constructor.name}'.`
      )
    }

    return domString
  }

  [internal.getVDOM]() {
    return create(this[internal.getDOMString]())
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
    render(this[internal.vDOM], this[internal.shadowRoot])
    this[internal.runLifecycle](external.elementDidMount)
    this[internal.isFirstRender] = false
  }

  /**
   * All renders after initial render:
   * Create a new vdom and update the existing one.
   */
  [internal.getNextRenderState]() {
    let nextVDOM = this[internal.getVDOM]()
    update(nextVDOM, this[internal.vDOM])
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
