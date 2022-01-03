import { denyUnlessSigned, sign } from "snabbdom-signature"
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
  denyUnlessSigned,
])

export function renderer({ Internal, External }) {
  function getRenderState(element) {
    if (isFunction(element[External.render])) {
      return sign(element[External.render]())
    } else {
      throw new Error(
        `[RotomElement]: You must include a render method in element: '${element.constructor.name}'`
      )
    }
  }

  function getInitialRenderState(element) {
    const vNode = toVNode(document.createElement("div"))
    element[Internal.vDOM] = patch(vNode, getRenderState(element))
    element.shadowRoot.appendChild(element[Internal.vDOM].elm)
    element[Internal.runLifecycle](External.onMount)
  }

  function getNextRenderState(element) {
    element[Internal.vDOM] = patch(
      element[Internal.vDOM],
      getRenderState(element)
    )
    element[Internal.runLifecycle](External.onUpdate)
  }

  return {
    patch(element) {
      if (!window || !window.document) return

      if (element[Internal.isFirstRender]) {
        element[Internal.isFirstRender] = false
        getInitialRenderState(element)
      } else {
        getNextRenderState(element)
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
