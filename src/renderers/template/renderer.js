import { patch, render, create } from "omdomdom"
import { isString } from "../../utilities/index.js"
import { Internal, External } from "../../enums.js"

const emptyVNode = {
  type: "comment",
  attributes: {},
  children: null,
  content: "",
  node: document.createComment(""),
}

function getRenderState(element) {
  const domString = element[External.render]()

  if (!isString(domString)) {
    throw new Error(
      `[RotomElement]: You attempted to render a non-string template in element: '${element.constructor.name}'.`
    )
  }

  return domString
}

function getInitialRenderState(element) {
  element[Internal.vnode] = create(getRenderState(element))
  render(element[Internal.vnode], element.shadowRoot)
}

function getNextRenderState(element) {
  let nextVnode = create(getRenderState(element))
  patch(nextVnode, element[Internal.vnode])
  nextVnode = null
}

export const templateRenderer = {
  patch(element) {
    if (element[Internal.isFirstRender]) {
      getInitialRenderState(element)
    } else {
      getNextRenderState(element)
    }
  },
  destroy(element) {
    patch(emptyVNode, element[Internal.vnode])
  },
}
