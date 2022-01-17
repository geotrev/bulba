import { denyUnlessSigned, sign } from "snabbdom-signature"
import { Internal } from "../../enums.js"
import { transformJsxProps } from "./transformers/index.js"

let snabbdom, patch

export async function patchJsxRoot(element, nextState) {
  if (!snabbdom) {
    try {
      const module = await import("snabbdom")
      snabbdom = module
      patch = module.init([
        module.classModule,
        module.propsModule,
        module.styleModule,
        module.eventListenersModule,
        module.attributesModule,
        module.datasetModule,
        denyUnlessSigned,
      ])
    } catch (e) {
      throw new Error(
        "[RotomElement]: Unable to retrieve `snabbdom` and/or `snabbdom-signature`."
      )
    }
  }

  const vnode = sign(transformJsxProps(nextState))

  if (element[Internal.isFirstRender]) {
    const baseNode = snabbdom.toVNode(document.createElement("div"))
    element[Internal.vnode] = patch(baseNode, vnode)
    element.shadowRoot.appendChild(element[Internal.vnode].elm)
  } else {
    element[Internal.vnode] = patch(element[Internal.vnode], vnode)
  }
}

export function destroyJsxRoot(element) {
  element[Internal.vnode] = patch(element[Internal.vnode], snabbdom.h("!"))

  const children = element.shadowRoot.childNodes
  if (children.length) {
    Array.prototype.forEach.call(children, (child) =>
      element.shadowRoot.removeChild(child)
    )
  }
}
