import { Internal } from "../../enums.js"

const emptyVNode = {
  type: "comment",
  attributes: {},
  children: null,
  content: "",
  node: document.createComment(""),
}

let patch, render, create

export async function patchTemplate(element, nextState) {
  if (!patch || !render || !create) {
    try {
      const module = await import("omdomdom")
      patch = module.patch
      render = module.render
      create = module.create
    } catch (e) {
      throw new Error("[RotomElement]: Unable to retrieve `omdomdom`.")
    }
  }

  if (element[Internal.isFirstRender]) {
    element[Internal.vnode] = create(nextState)
    render(element[Internal.vnode], element.shadowRoot)
  } else {
    let nextVnode = create(nextState)
    patch(nextVnode, element[Internal.vnode])
    nextVnode = null
  }
}

export function destroyTemplate(element) {
  patch(emptyVNode, element[Internal.vnode])

  const children = element.shadowRoot.childNodes
  if (children.length) {
    Array.prototype.forEach.call(children, (child) =>
      element.shadowRoot.removeChild(child)
    )
  }
}
