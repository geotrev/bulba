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
    const abbrevName = kebabToCamel(key.slice(5))

    if (node.data.dataset) {
      node.data.dataset[abbrevName] = value
    } else {
      node.data.dataset = { [abbrevName]: value }
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

  setPropToModule(vnode, /^on-/, ({ key, value, node }) => {
    const abbrevName = key.split("-")[1]

    if (node.data.on) {
      node.data.on[abbrevName] = value
    } else {
      node.data.on = { [abbrevName]: value }
    }

    delete node.data[key]
  })

  setPropToModule(vnode, /^hook-/, ({ key, value, node }) => {
    const abbrevName = key.split("-")[1]

    if (node.data.hook) {
      node.data.hook[abbrevName] = value
    } else {
      node.data.hook = { [abbrevName]: value }
    }

    delete node.data[key]
  })

  return vnode
}
