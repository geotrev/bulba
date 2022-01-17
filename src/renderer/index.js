import { External, Internal } from "../enums.js"
import { patchTemplate, destroyTemplate } from "./template/index.js"
import { patchJsx, destroyJsx } from "./jsx/index.js"
import { isFunction } from "../utilities/index.js"

function runPatchLifecycle(element) {
  if (element[Internal.isFirstRender]) {
    element[Internal.isFirstRender] = false
    element[Internal.runLifecycle](External.onMount)
  } else {
    element[Internal.runLifecycle](External.onUpdate)
  }
}

export function getRenderer() {
  return {
    async patch(element) {
      if (!window || !window.document) return

      let nextState
      if (isFunction(element[External.render])) {
        nextState = element[External.render]()
      } else {
        throw new Error(
          `[RotomElement]: You must include a render method in element: '${element.constructor.name}'`
        )
      }

      const type = typeof nextState
      if (type === "string") {
        await patchTemplate(element, nextState)
      } else {
        await patchJsx(element, nextState)
      }

      runPatchLifecycle(element)
    },
    async destroy(element) {
      if (!window || !window.document) return

      const nextState = element[External.render]()
      const type = typeof nextState

      element[Internal.runLifecycle](External.onUnmount)
      element[Internal.isFirstRender] = true

      if (type === "string") {
        await destroyTemplate(element)
      } else {
        await destroyJsx(element)
      }

      element[Internal.vnode] = null
    },
  }
}
