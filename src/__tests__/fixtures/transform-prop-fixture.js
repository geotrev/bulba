import { jsx } from "snabbdom"
import { RotomElement, register } from "../../rotom.jsx.js"

/**
 * Create a test fixture with custom accessors. The id must be unique as we
 * can't unregister custom elements from the DOM, even between tests.
 * @param {string} id
 */
export function createPropTransformFixture(
  id,
  { className, ariaLabel, dataset, handler, hookDestroy } = {}
) {
  class TestElement extends RotomElement {
    render() {
      return (
        <div
          className={className}
          aria-label={ariaLabel}
          data-baz-buz={dataset}
          on-click={handler}
          hook-destroy={hookDestroy}
        >
          Prop test
        </div>
      )
    }
  }

  register(`test-${id}`, TestElement)
  document.body.innerHTML = `<test-${id}></test-${id}>`
}
