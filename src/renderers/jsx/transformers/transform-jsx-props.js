import { kebabToCamel } from "../../../utilities"
import { setPropToModule } from "./set-prop-to-module"

/**
 * Transform JSX props to snabbdom module data structure.
 * @param {Object} vnode
 * @returns {Object} vnode
 */
export function transformJsxProps(vnode) {
  setPropToModule(vnode, /^aria-/, ({ key, value, node }) => {
    // debugger
    if (node.data.attrs) {
      node.data.attrs[key] = value
    } else {
      node.data.attrs = { [key]: value }
    }
    delete node.data[key]
  })

  setPropToModule(vnode, /^data-/, ({ key, value, node }) => {
    const abbrevKey = kebabToCamel(key.slice(5))

    if (node.data.dataset) {
      node.data.dataset[abbrevKey] = value
    } else {
      node.data.dataset = { [abbrevKey]: value }
    }

    delete node.data[key]
  })

  setPropToModule(vnode, /^className$/, ({ value, node }) => {
    if (node.data.props) {
      node.data.props.className = value
    } else {
      node.data.props = { className: value }
    }

    delete node.data.className
  })

  return vnode
}
