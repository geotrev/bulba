import { Rotom, register } from "../../rotom.template"

/**
 * Create a test fixture. The id must be unique as we can't unregister custom
 * elements from the DOM, even between tests.
 * @param {string} id
 * @param {{content: string, properties: Object, styles: string}}
 */
export function createBasicFixture(id, options = {}) {
  class TestElement extends Rotom {
    constructor() {
      super()
    }

    static get properties() {
      return options.properties || {}
    }

    static get styles() {
      return options.styles
    }

    render() {
      if (options.properties) {
        const propertiesToString = () => {
          let result = ""

          for (let propName in options.properties) {
            result += " " + this[propName]
          }

          return result
        }

        return `<div>${propertiesToString()}</div>`
      } else if (options.content) {
        return options.content
      } else {
        return `<div>default content</div>`
      }
    }
  }

  register(`test-${id}`, TestElement)

  if (options.content && options.content.includes("slot")) {
    document.body.innerHTML = `<test-${id}><div slot='${options.slotName}'>Test slot</div></test-${id}>`
  } else {
    document.body.innerHTML = `<test-${id}></test-${id}>`
  }
}
