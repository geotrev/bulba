import { create, patch, render } from "omdomdom"
import { createScheduler } from "./scheduler"
import { upgradeProperty } from "./properties"
import * as internal from "./internal"
import * as external from "./external"
import {
  isEmptyObject,
  isString,
  isFunction,
  getTypeTag,
  toKebabCase,
  createUUID,
  emptyVNode,
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
    // It's possible for elements to queue this callback
    // and then get disconnected before this callback is
    // eventually resolved.
    if (!this.isConnected) return

    this[internal.runLifecycle](external.elementDidConnect)
    this[internal.renderStyles]()
    this[external.requestRender]()
  }

  disconnectedCallback() {
    this[internal.runLifecycle](external.elementWillUnmount)
    this[internal.cleanup]()
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
    this[internal.schedule] = createScheduler()

    // Internal properties and metadata
    this[internal.renderDOM] = this[internal.renderDOM].bind(this)
    this[internal.isFirstRender] = true
    this[internal.vDOM] = null
    this[internal.shadowRoot] = this.attachShadow({ mode: "open" })

    // Set id
    this[internal.elementId] = createUUID()
    this.setAttribute(
      external.elementIdAttribute,
      this[external.elementIdProperty]
    )

    // Set document direction for reflow support in shadow roots
    this.setAttribute("dir", String(document.dir || "ltr"))

    this[internal.performUpgrade]()
  }

  /**
   * Called during disconnectedCallback. Clean up the vDOM
   * and remove remaining nodes in the shadowRoot.
   */
  [internal.cleanup]() {
    this[internal.vDOM] = null

    // Clean up any other nodes in the shadow root
    const children = this[internal.shadowRoot].childNodes
    if (children.length) {
      Array.prototype.forEach.call(children, (child) =>
        this[internal.shadowRoot].removeChild(child)
      )
    }

    // If the element is attached to the DOM again for any
    // reason, treat it like the first render.
    this[internal.isFirstRender] = true
  }

  /**
   * Upgrade properties detected in the extender.
   */
  [internal.performUpgrade]() {
    const { properties } = this.constructor

    if (isEmptyObject(properties)) return

    for (let propName in properties) {
      upgradeProperty(this, propName, properties[propName])
    }
  }

  /**
   * Retrieves the dom string from the extender.
   * @returns {string} - Stringified HTML from the extender's render method.
   */
  [internal.getDOMString]() {
    let domString

    if (isFunction(this[external.render])) {
      domString = this[external.render]()
    } else {
      throw new Error(
        `[UpgradedElement]: You must include a render method in element: '${this.constructor.name}'`
      )
    }

    if (!isString(domString)) {
      throw new Error(
        `[UpgradedElement]:  You attempted to render a non-string template in element: '${this.constructor.name}'.`
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
  [internal.setInitialRenderState]() {
    this[internal.vDOM] = this[internal.getVDOM]()
    render(this[internal.vDOM], this[internal.shadowRoot])
    this[internal.runLifecycle](external.elementDidMount)
  }

  /**
   * All renders after initial render:
   * Create a new vdom and patch the existing one.
   */
  [internal.setNextRenderState]() {
    let nextVDOM = this[internal.getVDOM]()
    patch(nextVDOM, this[internal.vDOM])
    this[internal.runLifecycle](external.elementDidUpdate)
    nextVDOM = null
  }

  /**
   * Runs either a new render or diffs the existing virtual DOM to a new one.
   */
  [internal.renderDOM]() {
    if (this[internal.isFirstRender]) {
      this[internal.isFirstRender] = false
      this[internal.setInitialRenderState]()
    } else {
      this[internal.setNextRenderState]()
    }
  }
}
