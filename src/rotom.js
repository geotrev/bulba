import { createDOMMap, diffDOM, stringToHTML, renderMapToDOM } from "./dom"
import { createUUID, toKebab, loadScheduler } from "./utilities"
import * as internal from "./internal"

const COMPONENT_ROOT_CLASSNAME = "component-root"

export class Rotom extends HTMLElement {
  constructor() {
    super()
    this[internal.initialize]()
  }

  // Public

  static get observedAttributes() {
    let attributes = []

    if (typeof this.properties === "object" && Object.keys(this.properties).length) {
      Object.keys(this.properties).forEach(property => {
        if (property.reflected) attributes.push(toKebab(property))
      })
    }

    return attributes
  }

  // Keep these around in case they become useful later.
  // Consumers will need to call super(), in the mean time.
  attributeChangedCallback() {}
  adoptedCallback() {}
  connectedCallback() {}
  disconnectedCallback() {}

  get componentId() {
    return this[internal.componentId]
  }

  requestRender() {
    window.schedule(this[internal.renderDOM])
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

    this[internal.renderStyles]()
    this[internal.renderDOM]()
  }

  [internal.performUpgrade]() {
    const { properties } = this.constructor
    if (!properties) return

    const propNames = Object.keys(properties)

    if (propNames.length) {
      propNames.forEach(property => {
        this[internal.createProperty](property, properties[property])
      })
    }
  }

  [internal.renderStyles]() {
    if (typeof this.styles !== "function") return
    const styles = this.styles()
    if (typeof styles !== "string") return

    const styleTag = document.createElement("style")
    styleTag.type = "text/css"
    styleTag.textContent = styles
    this[internal.shadowRoot].appendChild(styleTag)
  }

  [internal.renderDOM]() {
    if (this[internal.domRoot]) {
      let templateMap = createDOMMap(stringToHTML(this[internal.getDOMString]()))

      // TODO: If templateMap root node outerHTML equals domMap root node outerHTML, return
      diffDOM(templateMap, this[internal.domMap], this[internal.domRoot])
      templateMap = null
    } else {
      this[internal.domMap] = createDOMMap(stringToHTML(this[internal.getDOMString]()))
      this[internal.domRoot] = document.createElement("div")
      this[internal.domRoot].setAttribute("id", COMPONENT_ROOT_CLASSNAME)
      renderMapToDOM(this[internal.domMap], this[internal.shadowRoot])
    }

    console.log("Rendered")
  }

  [internal.validateType](property, type, value) {
    if (!type) return
    if (typeof value === type) return

    return console.warn(
      `Property '${property}' assigned unsupported type: '${typeof value}'. Expected '${type}'. Check ${
        this.constructor.name
      }.`
    )
  }

  [internal.createProperty](property, data = {}) {
    const internalName = typeof property === "symbol" ? Symbol(property) : `__${property}__`
    const { initialValue, type } = data
    const attribute = toKebab(property)
    const observedAttributes = this.constructor.observedAttributes

    if (typeof initialValue !== "undefined") {
      this[internal.validateType](property, type, initialValue)
      this[internalName] = initialValue
    }

    Object.defineProperty(this, property, {
      configurable: true,
      enumerable: true,
      get() {
        return this[internalName]
      },
      set(value) {
        this[internal.validateType](property, type, value)

        if (value) {
          this[internalName] = value

          if (observedAttributes && observedAttributes.indexOf(attribute) > -1) {
            this.setAttribute(attribute, value)
          }
        } else {
          this[internalName] = undefined

          if (observedAttributes && observedAttributes.indexOf(attribute) > -1) {
            this.removeAttribute(attribute)
          }
        }

        // NOTE: Because the renderer is synchronous, it can cause serious
        // DOM thrashing. Therefore setTimeout is merely a way to spreadout DOM updates
        // across frames, preventing complex layouts from freezing up.
        window.schedule(this[internal.renderDOM])
      },
    })
  }

  [internal.getDOMString]() {
    let domString

    if (typeof this.render === "function") {
      domString = this.render()
    } else {
      throw new Error(
        `You must include a render method in your component. Component: ${this.constructor.name}`
      )
    }

    if (typeof domString !== "string")
      throw new Error(
        `You attempted to render a non-string template. Check ${this.constructor.name}.render.`
      )

    return domString.trim()
  }
}
