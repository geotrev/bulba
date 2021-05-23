import { createScheduler } from "./scheduler"
import { upgradeProperty } from "./properties"
import { renderers, TEMPLATE, validRenderers } from "./renderers"
import { Attributes, AttributeValues } from "./enums"
import * as internal from "./internal"
import * as external from "./external"
import {
  isEmptyObject,
  isString,
  isFunction,
  getTypeTag,
  toKebabCase,
  createUUID,
} from "./utilities"

const SHADOW_ROOT_MODE = "open"

/**
 * @module Rotom
 * @extends HTMLElement
 */
export class Rotom extends HTMLElement {
  constructor() {
    super()
    this[internal.initialize]()
  }

  // Retrieve defined properties from the extender.
  static get observedAttributes() {
    const properties = this[external.staticProperties]

    if (isEmptyObject(properties)) return []

    let attributes = []
    for (let propName in properties) {
      if (!properties[propName].reflected) continue
      attributes.push(toKebabCase(propName))
    }
    return attributes
  }

  // Keep adoptedCallback around in case it becomes useful later.
  // Consumers will need to call super() to remain compatible, in the mean time.
  adoptedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[internal.runPossibleConstructorMethod](
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

    this[internal.upgrade]()
    this[internal.runPossibleConstructorMethod](external.elementDidConnect)
    this[internal.renderStyles]()
    this[external.requestRender]()
  }

  disconnectedCallback() {
    this[internal.runPossibleConstructorMethod](external.elementWillUnmount)
    this[internal.destroy]()
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
      `[Rotom]: Property '${propName}' is invalid type of '${evaluatedType}'. Expected '${type}'. Check ${this.constructor.name}.`
    )
  }

  // Private

  /**
   * If the method is defined by the constructor, run it.
   * @param {string} methodName - name of the possible method
   * @param {arguments} args - args to pass along to the method, if any
   */
  [internal.runPossibleConstructorMethod](methodName, ...args) {
    if (isFunction(this[methodName])) {
      this[methodName](...args)
    }
  }

  /**
   * Do initial setup work, then upgrade.
   */
  [internal.initialize]() {
    this[internal.schedule] = createScheduler()
    this[internal.setRenderer]()

    // Internal properties and metadata
    this[internal.renderDOM] = this[internal.renderDOM].bind(this)
    this[internal.isFirstRender] = true
    this[internal.vDOM] = null
    this[internal.shadowRoot] = this.attachShadow({ mode: SHADOW_ROOT_MODE })

    // Set id
    this[internal.elementId] = createUUID()
  }

  [internal.upgrade]() {
    this.setAttribute(
      external.elementIdAttribute,
      this[external.elementIdProperty]
    )

    // Set document direction for reflow support in shadow roots
    this.setAttribute(
      Attributes.dir,
      String(document.dir || AttributeValues.ltr)
    )

    this[internal.upgradeProperties]()
  }

  /**
   * Upgrade properties detected in the extender.
   */
  [internal.upgradeProperties]() {
    const properties = this.constructor[external.staticProperties]

    if (isEmptyObject(properties)) return

    for (let propName in properties) {
      upgradeProperty(this, propName, properties[propName])
    }
  }

  [internal.setRenderer]() {
    const { renderer = TEMPLATE } = this.constructor
    const rendererIsValid =
      isString(renderer) && validRenderers.indexOf(renderer) > -1

    if (!rendererIsValid) {
      throw new Error("[Rotom]: Invalid renderer provided.")
    }

    this[internal.renderer] = renderers[renderer]
  }

  /**
   * Called during disconnectedCallback. Clean up the vDOM
   * and remove remaining nodes in the shadowRoot.
   */
  [internal.destroy]() {
    this[internal.renderer].destroy(this)
  }

  /**
   * Creates the style tag and appends styles as detected in the extender.
   */
  [internal.renderStyles]() {
    const styles = this.constructor[external.staticStyles]

    if (!isString(styles)) return

    const styleTag = document.createElement("style")
    styleTag.type = "text/css"
    styleTag.textContent = styles
    this[internal.shadowRoot].appendChild(styleTag)
  }

  /**
   * Runs either a new render or diffs the existing virtual DOM to a new one.
   */
  [internal.renderDOM]() {
    this[internal.renderer].renderDOM(this)
  }
}
