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
import { Internal, External } from "../../enums"
import { isFunction } from "../../utilities"
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
}

function getNextRenderState(element) {
  element[Internal.vnode] = patch(
    element[Internal.vnode],
    getRenderState(element)
  )
}

export const jsxRenderer = {
  patch(element) {
    if (element[Internal.isFirstRender]) {
      getInitialRenderState(element)
    } else {
      getNextRenderState(element)
    }
  },
  destroy(element) {
    element[Internal.vnode] = patch(
      element[Internal.vnode],
      createEmptyVNode(element, Internal)
    )
  },
}
