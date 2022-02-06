import { RotomElement as RotomTemplate } from "../../rotom.template"
import { RotomElement as RotomJsx } from "../../rotom.jsx"
import { register } from "../../register"
import { createElement } from "./create-element"

let id = 0

const Modes = {
  TEMPLATE: RotomTemplate,
  JSX: RotomJsx,
}

export function mount(options = {}) {
  const tagName = `test-${++id}`
  const {
    wait = false,
    attributes = {},
    properties = {},
    styles = "",
    view,
  } = options

  const BaseClass = typeof view === "string" ? Modes.TEMPLATE : Modes.JSX

  class TestElement extends BaseClass {
    constructor() {
      super()
      this._count = 0
    }

    static get properties() {
      return properties
    }

    static get styles() {
      return styles
    }

    get count() {
      return this._count
    }

    set count(value) {
      this._count = value
    }

    render() {
      this.count = this.count + 1
      return view
    }
  }

  register(tagName, TestElement)

  const render = () => {
    const fixture = createElement(tagName, attributes)
    document.body.appendChild(fixture)
    return fixture
  }

  if (wait) {
    return [TestElement, render]
  } else {
    return render()
  }
}
