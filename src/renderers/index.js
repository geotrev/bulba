import { isFunction } from "../utilities"
import { Internal, External } from "../enums"

/**
 * Sets up render methods for given renderer.
 * @param {HTMLElement} element
 * @param {{patch: Function, destroy: Function}} renderer
 */
export function setRenderer(renderer) {
  return {
    patch(element) {
      if (!window || !window.document) return

      if (!isFunction(element[External.render])) {
        throw new Error(
          `[RotomElement]: You must include a render method in element: '${element.constructor.name}'`
        )
      }

      renderer.patch(element)

      if (element[Internal.isFirstRender]) {
        element[Internal.isFirstRender] = false
        element[Internal.runLifecycle](External.onMount)
      } else {
        element[Internal.runLifecycle](External.onUpdate)
      }
    },
    destroy(element) {
      if (!window || !window.document) return

      element[Internal.isFirstRender] = true
      element[Internal.runLifecycle](External.onUnmount)

      renderer.destroy(element)

      element[Internal.vnode] = null
      const children = Array.apply(null, element.shadowRoot.childNodes)
      if (children.length) {
        Array.prototype.forEach.call(children, (child) =>
          element.shadowRoot.removeChild(child)
        )
      }
    },
  }
}
