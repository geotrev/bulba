import { RotomElement, register } from "../../rotom.template"

/**
 * Create a test fixture with custom accessors. The id must be unique as we
 * can't unregister custom elements from the DOM, even between tests.
 * @param {string} id
 */
export function createTempLifecycleFixture(id, wait = false) {
  class TestElement extends RotomElement {
    constructor() {
      super()
    }

    static get properties() {
      return {
        testProp: {
          type: "boolean",
          default: false,
          reflected: true,
        },
      }
    }

    render() {
      return "<div>default content</div>"
    }
  }

  const init = () => {
    register(`test-${id}`, TestElement)
    document.body.innerHTML = `<test-${id}></test-${id}>`
  }

  if (wait) {
    return [init, TestElement]
  } else {
    init()
    return TestElement
  }
}
