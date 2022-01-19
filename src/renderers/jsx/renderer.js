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
import { isFunction } from "../../utilities/is-type"
import { transformJsxProps } from "./transformers"

const createEmptyVNode = (element, Internal) =>
  h("!", {
    hooks: {
      post: () => {
        element[Internal.vnode] = null
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
      const vnode = transformJsxProps(element[External.render]())
      return sign(vnode)
    } else {
      throw new Error(
        `[RotomElement]: You must include a render method in element: '${element.constructor.name}'`
      )
    }
  }

  function getInitialRenderState(element) {
    const vnode = toVNode(document.createElement("div"))
    element[Internal.vnode] = patch(vnode, getRenderState(element))
    element.shadowRoot.appendChild(element[Internal.vnode].elm)
    element[Internal.runLifecycle](External.onMount)
  }

  function getNextRenderState(element) {
    element[Internal.vnode] = patch(
      element[Internal.vnode],
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

      element[Internal.isFirstRender] = true

      element[Internal.vnode] = patch(
        element[Internal.vnode],
        createEmptyVNode(element, Internal)
      )
      element[Internal.vnode] = null

      const children = element.shadowRoot.childNodes
      if (children.length) {
        Array.prototype.forEach.call(children, (child) =>
          element.shadowRoot.removeChild(child)
        )
      }
    },
  }
}
