// import { denyUnlessSigned, signingH } from "snabbdom-signature"
import {
  init,
  h,
  toVNode,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  attributesModule,
  datasetModule,
} from "snabbdom"
import { isFunction } from "./utilities"

const createEmptyVNode = (element, internal) =>
  h("!", {
    hooks: {
      post: () => {
        element[internal.vDOM] = null
      },
    },
  })

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  attributesModule,
  datasetModule,
  // denyUnlessSigned
])

export function renderer({ internal, external }) {
  function getNextRenderState(element) {
    if (isFunction(element[external.render])) {
      return element[external.render]()
    } else {
      throw new Error(
        `[Rotom]: You must include a render method in element: '${element.constructor.name}'`
      )
    }
  }

  function setInitialRenderState(element) {
    const vNode = toVNode(document.createElement("div"))
    element[internal.vDOM] = patch(vNode, getNextRenderState(element))
    element[internal.shadowRoot].appendChild(vNode.elm)
  }

  return {
    renderDOM(element) {
      if (element[internal.isFirstRender]) {
        element[internal.isFirstRender] = false
        setInitialRenderState(element)
      } else {
        element[internal.vDOM] = patch(
          element[internal.vDOM],
          getNextRenderState(element)
        )
      }
    },
    destroy(element) {
      patch(element[internal.vDOM], createEmptyVNode(element, internal))
    },
  }
}
