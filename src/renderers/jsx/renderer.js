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

const createEmptyVNode = (element, Internal) =>
  h("!", {
    hooks: {
      post: () => {
        element[Internal.vDOM] = null
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

export function renderer({ Internal, External }) {
  function getNextRenderState(element) {
    if (isFunction(element[External.render])) {
      return element[External.render]()
    } else {
      throw new Error(
        `[Rotom]: You must include a render method in element: '${element.constructor.name}'`
      )
    }
  }

  function setInitialRenderState(element) {
    const vNode = toVNode(document.createElement("div"))
    element[Internal.vDOM] = patch(vNode, getNextRenderState(element))
    element.shadowRoot.appendChild(vNode.elm)
  }

  return {
    patch(element) {
      if (!window || !window.document) return

      if (element[Internal.isFirstRender]) {
        element[Internal.isFirstRender] = false
        setInitialRenderState(element)
      } else {
        element[Internal.vDOM] = patch(
          element[Internal.vDOM],
          getNextRenderState(element)
        )
      }
    },
    destroy(element) {
      if (!window || !window.document) return

      element[Internal.vDOM] = patch(
        element[Internal.vDOM],
        createEmptyVNode(element, Internal)
      )
    },
  }
}
