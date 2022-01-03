import { RotomElement, register } from "../../rotom.template"

/**
 * Create a test fixture with custom accessors. The id must be unique as we
 * can't unregister custom elements from the DOM, even between tests.
 * @param {string} id
 */
export function createAccessorFixture(id) {
  class TestElement extends RotomElement {
    constructor() {
      super()
      this._count = 0
    }

    static get properties() {
      return {
        count: {
          default: 99999,
        },
      }
    }

    get count() {
      return this._count
    }

    set count(value) {
      this._count = value
    }

    render() {
      this.count = this.count + 1
      return "<div>rendered " + this.count + " times</div>"
    }
  }

  register(`test-${id}`, TestElement)
  document.body.innerHTML = `<test-${id}></test-${id}>`
}
