import { patch, render, create } from "omdomdom"
import { isString, isFunction } from "./utilities"

export function renderer({ Internal, External }) {
  function getRenderState(element) {
    let domString

    if (isFunction(element[External.render])) {
      domString = element[External.render]()
    } else {
      throw new Error(
        `[Rotom]: You must include a render method in element: '${element.constructor.name}'`
      )
    }

    if (!isString(domString)) {
      throw new Error(
        `[Rotom]: You attempted to render a non-string template in element: '${element.constructor.name}'.`
      )
    }

    return domString
  }

  function setInitialRenderState(element) {
    element[Internal.vDOM] = create(getRenderState(element))
    render(element[Internal.vDOM], element.shadowRoot)
    element[Internal.runLifecycle](External.onMount)
  }

  function setNextRenderState(element) {
    let nextVDOM = create(getRenderState(element))
    patch(nextVDOM, element[Internal.vDOM])
    element[Internal.runLifecycle](External.onUpdate)
    nextVDOM = null
  }

  return {
    patch(element) {
      if (!window || !window.document) return

      if (element[Internal.isFirstRender]) {
        element[Internal.isFirstRender] = false
        setInitialRenderState(element)
      } else {
        setNextRenderState(element)
      }
    },
    destroy(element) {
      if (!window || !window.document) return

      const emptyVNode = {
        type: "comment",
        attributes: {},
        children: null,
        content: "",
        node: document.createComment(""),
      }

      element[Internal.isFirstRender] = true
      patch(emptyVNode, element[Internal.vDOM])
      element[Internal.vDOM] = null

      const children = element.shadowRoot.childNodes
      if (children.length) {
        Array.prototype.forEach.call(children, (child) =>
          element.shadowRoot.removeChild(child)
        )
      }
    },
  }
}
