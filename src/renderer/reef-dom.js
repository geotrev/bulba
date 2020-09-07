/**
 * Credit for this virtual dom implementation goes to Chris Ferdinandi.
 * It's mostly the same as reefjs, but changes the data structure slightly
 * in select areas.
 * https://github.com/cferdinandi/reef
 */

/**
 * Object representation of a DOM element.
 * @typedef VirtualNode
 * @type {Object}
 * @property {string} type - The type of node. E.g., tag name, "comment", or "text".
 * @property {Object.<string, string>} attributes - List of attributes, if any.
 * @property {TextNode|CommentNode} content - Text or comment content, if any.
 * @property {VirtualNode[]} children - Child virtual nodes, if any.
 * @property {HTMLElement} node - The corresponding DOM element.
 * @property {boolean} isSVGNode
 */

/**
 * @type {string[]}
 */
const dynamicAttributes = ["checked", "selected", "value"]

/**
 * Reverse for loop for improved performance.
 * @param {[]} items
 * @param callback
 */
const forEachReverse = (items, callback) => {
  for (let i = items.length - 1; i >= 0; i--) {
    callback(items[i])
  }
}

/**
 * Takes an inline style string and reduces it to
 * an array of objects per prop/value pair.
 * @param {string} styles
 * @returns {Attribute[]}
 */
const styleStringToMap = (styles) => {
  return styles.split(";").reduce((allStyles, style) => {
    const entry = style.trim()

    if (entry.indexOf(":") > 0) {
      const [name, value] = entry.split(":")
      if (value.trim() !== "") {
        return { ...allStyles, [name.trim()]: value.trim() }
      }
    }

    return allStyles
  }, {})
}

/**
 * Removes inline styles from the element.
 * @param {HTMLElement} element
 * @param {Attribute[]} styles
 */
const removeStyles = (element, styles) => {
  forEachReverse(styles, (property) => (element.style[property] = ""))
}

/**
 * Adds inline styles to the element.
 * @param {HTMLElement} element
 * @param {Attribute[]} styles
 */
const updateStyles = (element, properties, styleMap) => {
  forEachReverse(properties, (property) => {
    if (element.style[property] === styleMap[property]) return
    element.style[property] = styleMap[property]
  })
}

/**
 * Updates styles on element.
 * @param {HTMLElement} element
 * @param {string} styles
 */
const diffStyles = (element, styles) => {
  const styleMap = styleStringToMap(styles)
  const styleProps = Object.keys(styleMap)

  // Get styles to remove
  const staleStyles = Array.prototype.filter.call(
    element.style,
    (style) => styleMap[style] === undefined
  )

  // Remove + update changes
  removeStyles(element, staleStyles)
  updateStyles(element, styleProps, styleMap)
}

/**
 * Removes stale attributes from the element.
 * @param {HTMLElement} element
 * @param {Attribute[]} attributes
 */
const removeAttributes = (element, attributes) => {
  attributes.forEach((attribute) => {
    // If the attribute is `class` or `style`, unset the properties.
    if (attribute === "class") {
      element.className = ""
    } else if (attribute === "style") {
      removeStyles(element, Array.prototype.slice.call(element.style))
    } else if (attribute in element) {
      // If the attribute is also a property, unset it
      element[attribute] = ""
    }

    // Clean up the DOM attribute
    element.removeAttribute(attribute)
  })
}

/**
 * Adds attributes to the element.
 * @param {HTMLElement} element
 * @param {Attribute[]} attributes
 */
const addAttributes = (element, attributes) => {
  forEachReverse(Object.keys(attributes), (attribute) => {
    const value = attributes[attribute]
    // If the attribute is `class` or `style`, apply those as properties.
    if (attribute === "class") {
      element.className = value
    } else if (attribute === "style") {
      diffStyles(element, value)
    } else {
      // If the attribute is also a property, set it
      if (attribute in element) {
        element[attribute] = value || attribute
      }
      element.setAttribute(attribute, value || "")
    }
  })
}

/**
 * Create a new element from virtual node.
 * @param {VirtualNode} vNode
 */
const createElement = (vNode) => {
  let element
  if (vNode.type === "text") {
    element = document.createTextNode(vNode.content)
  } else if (vNode.type === "comment") {
    element = document.createComment(vNode.content)
  } else if (vNode.isSVGNode) {
    element = document.createElementNS("http://www.w3.org/2000/svg", vNode.type)
  } else {
    element = document.createElement(vNode.type)
  }

  addAttributes(element, vNode.attributes)

  if (vNode.children.length > 0) {
    vNode.children.forEach((childElement) => {
      element.appendChild(createElement(childElement))
    })
  } else if (vNode.type !== "text") {
    element.textContent = vNode.content
  }

  return element
}

/**
 * Gets dynamic property-based attributes to be applied.
 * @param {HTMLElement} element
 * @param {Object.<string, string>} attributes
 */
const getDynamicAttributes = (element, attributes) => {
  forEachReverse(dynamicAttributes, (prop) => {
    if (!element[prop]) return
    attributes[prop] = element[prop]
  })
}

/**
 * Gets non-dynamic node attributes to be applied.
 * @param {HTMLElement} element
 * @returns {Object.<string, string>}
 */
const getBaseAttributes = (element) => {
  let attributes = {}

  Array.prototype.forEach.call(element.attributes, (attribute) => {
    if (dynamicAttributes.indexOf(attribute.name) < 0) {
      attributes[attribute.name] = attribute.value
    }
  })

  return attributes
}

/**
 * Gets all virtual node attributes.
 * @param {HTMLElement} element
 * @returns {Object.<string, string>}
 */
const getAttributes = (element) => {
  const attributes = getBaseAttributes(element)
  getDynamicAttributes(element, attributes)

  return attributes
}

/**
 * Reconcile attributes from oldVNode to nextVNode
 * @param {VirtualNode} nextVNode
 * @param {VirtualNode} oldVNode
 */
const diffAttributes = (nextVNode, oldVNode) => {
  let removedAttributes = []
  let changedAttributes = {}

  // Get stale attributes
  forEachReverse(Object.keys(oldVNode.attributes), (attr) => {
    const oldValue = oldVNode.attributes[attr]
    const nextValue = nextVNode.attributes[attr]
    if (oldValue === nextValue) return

    if (typeof nextValue === "undefined") {
      removedAttributes.push(attr)
    }
  })

  // Get changed or new attributes
  forEachReverse(Object.keys(nextVNode.attributes), (attr) => {
    const oldValue = oldVNode.attributes[attr]
    const nextValue = nextVNode.attributes[attr]
    if (oldValue === nextValue) return

    if (typeof nextValue !== "undefined") {
      changedAttributes[attr] = nextValue
    }
  })

  // Add and remove attributes
  removeAttributes(oldVNode.node, removedAttributes)
  addAttributes(oldVNode.node, changedAttributes)
}

// Starting at the top level, recursively iterate through the new map
// and update changes to the current one if there are differences.

/**
 * Export utilities
 */

/**
 * Reconcile nextVNode (new render state) against oldVNode (old render state).
 * - If nextVNode has a new `type`, rebuild the node and replace it
 * - If nextVNode has a different `children` structure (array vs object),
 *   rebuild it.
 * - If children is an array, begin comparing nodes.
 *   - when oldVNode.children[i].type !== nextVNode.children[i].type,
 *
 * @param {VirtualNode[]} nextVNode - new virtual DOM
 * @param {VirtualNode[]} oldVNode - old virtual DOM
 * @param {HTMLElement|ShadowRoot} root
 */
export const diffVDOM = (nextVNode, oldVNode, root) => {
  // // Remove missing children from map
  // let delta = oldVNode.length - nextVNode.length
  // if (delta > 0) {
  //   for (; delta > 0; delta--) {
  //     const vNode = oldVNode[oldVNode.length - delta]
  //     vNode.node.parentNode.removeChild(vNode.node)
  //   }
  // }
  // // Update existing and new nodes, recursively
  // nextVNode.forEach((node, index) => {
  //   const oldVNodeChild = oldVNode[index]
  //   const nextVNodeChild = nextVNode[index]
  //   // 1. Create and append new children
  //   if (!oldVNodeChild) {
  //     return root.appendChild(createElement(nextVNodeChild))
  //   }
  //   // 2. If element is not the same type, rebuild it
  //   if (nextVNodeChild.type !== oldVNodeChild.type) {
  //     return oldVNodeChild.node.parentNode.replaceChild(
  //       createElement(nextVNodeChild),
  //       oldVNodeChild.node
  //     )
  //   }
  //   // 3. Update attributes
  //   diffAttributes(nextVNodeChild, oldVNodeChild)
  //   // 4. Update content
  //   if (
  //     nextVNodeChild.content &&
  //     nextVNodeChild.content !== oldVNodeChild.content
  //   ) {
  //     oldVNodeChild.node.textContent = nextVNodeChild.content
  //   }
  //   // 5a. Remove stale child nodes
  //   if (oldVNodeChild.children.length > 0 && node.children.length < 1) {
  //     return (oldVNodeChild.node.innerHTML = "")
  //   }
  //   // 5b. Rebuild elements that are empty but shouldn't be
  //   //     Uses a document fragment to prevent unnecessary reflows
  //   if (oldVNodeChild.children.length < 1 && node.children.length > 0) {
  //     const fragment = document.createDocumentFragment()
  //     diffVDOM(node.children, oldVNodeChild.children, fragment)
  //     return root.appendChild(fragment)
  //   }
  //   // 5c. Diff any children of the current node.
  //   if (node.children.length > 0) {
  //     diffVDOM(node.children, oldVNodeChild.children, oldVNodeChild.node)
  //   }
  // })
}

/**
 * Renders a vDOM into the given root context. This happens one time,
 * when a component is first rendered.
 * All subsequent renders are the result of reconciliation.
 * @param {VirtualNode[]} vDOM
 * @param {ShadowRoot} context
 */
export const renderToDOM = (vNode, root) => {
  root.appendChild(vNode.node)
}

/**
 * Convert stringified HTML into valid HTML, stripping all extra spaces.
 * @param {string} stringToRender
 */
export const stringToHTML = (stringToRender) => {
  /**
   * Remove all extraneous whitespace:
   * - From the beginning + end of the document fragment
   * - If there's more than one space before a left tag bracket, replace them with one
   * - If there's more than one space before a right tag bracket, replace them with one
   */
  const processedDOMString = stringToRender
    .trim()
    .replace(/\s+</g, "<")
    .replace(/>\s+/g, ">")

  const parser = new DOMParser()
  const context = parser.parseFromString(processedDOMString, "text/html")
  return context.body
}

/**
 * 1. Detect shadow root as a type and set root node type
 *    - node.children is SR children (type === 11)
 * 2. Detect if children is flat
 *    - If childNodes.length > 1, use an array
 *    - If childNodes.length === 1, use object to directly access node
 * 3. Set attributes as key: value instead of array of {name, type}.
 */

/**
 * Creates a new virtual DOM from nodes within a given element.
 * @param {HTMLElement|ShadowRoot|HTMLBodyElement} element
 * @param {boolean} isSVGNode
 * @returns {VirtualNode[]}
 */
export const createVNode = (node, isSVGNode = false) => {
  const isRoot = node.tagName === "BODY"
  const childNodes = node.childNodes
  const numChildNodes = childNodes ? childNodes.length : 0

  if (isRoot) {
    if (numChildNodes > 1) {
      throw new Error(
        "UpgradedElement: Your element should not have more than one shadow root node."
      )
    } else if (numChildNodes === 0) {
      throw new Error(
        "UpgradedElement: Your element should have at least one shadow root node."
      )
    } else {
      return createVNode(childNodes[0])
    }
  }

  let vNode = { node }

  vNode.type =
    node.nodeType === 3
      ? "text"
      : node.nodeType === 8
      ? "comment"
      : node.tagName.toLowerCase()
  vNode.isSVGNode = isSVGNode || vNode.type === "svg"
  vNode.attributes = node.nodeType === 1 ? getAttributes(node) : {}
  vNode.content = numChildNodes > 0 ? null : node.textContent

  if (numChildNodes > 1) {
    vNode.children = Array.prototype.map.call(childNodes, (child) =>
      createVNode(child, vNode.isSVGNode)
    )
  } else if (numChildNodes === 1) {
    vNode.children = createVNode(childNodes[0])
  } else {
    vNode.children = null
  }

  return vNode
}
