import { patch, render, create } from "omdomdom"
import { isString, isFunction } from "./utilities"

export function renderer({ internal, external }) {
  function getRenderState(element) {
    let domString

    if (isFunction(element[external.render])) {
      domString = element[external.render]()
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
    element[internal.vDOM] = create(getRenderState(element))
    render(element[internal.vDOM], element[internal.shadowRoot])
    element[internal.runPossibleConstructorMethod](external.elementDidMount)
  }

  function setNextRenderState(element) {
    let nextVDOM = create(getRenderState(element))
    patch(nextVDOM, element[internal.vDOM])
    element[internal.runPossibleConstructorMethod](external.elementDidUpdate)
    nextVDOM = null
  }

  return {
    renderDOM(element) {
      if (element[internal.isFirstRender]) {
        element[internal.isFirstRender] = false
        setInitialRenderState(element)
      } else {
        setNextRenderState(element)
      }
    },

    destroy(element) {
      const emptyVNode = {
        type: "comment",
        attributes: {},
        children: null,
        content: "",
        node: document.createComment(""),
      }

      element[internal.isFirstRender] = true
      patch(emptyVNode, element[internal.vDOM])
      element[internal.vDOM] = null

      const children = element[internal.shadowRoot].childNodes
      if (children.length) {
        Array.prototype.forEach.call(children, (child) =>
          element[internal.shadowRoot].removeChild(child)
        )
      }
    },
  }
}
