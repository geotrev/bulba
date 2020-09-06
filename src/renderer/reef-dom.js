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
 * @property {boolean} isSVG
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
  // Get style map
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
  } else if (vNode.isSVG) {
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

    if (nextValue === undefined) {
      removedAttributes.push(attr)
    }
  })

  // Get changed or new attributes
  forEachReverse(Object.keys(nextVNode.attributes), (attr) => {
    const oldValue = oldVNode.attributes[attr]
    const nextValue = nextVNode.attributes[attr]
    if (oldValue === nextValue) return

    if (nextValue && (oldValue === undefined || oldValue !== nextValue)) {
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
 * Reconcile nextVDOM (new render state) against oldVDOM (old render state).
 * @param {VirtualNode[]} nextVDOM - new virtual DOM
 * @param {VirtualNode[]} oldVDOM - old virtual DOM
 * @param {HTMLElement|ShadowRoot} root
 */
export const diffVDOM = (nextVDOM, oldVDOM, root) => {
  // Remove missing children from map
  let delta = oldVDOM.length - nextVDOM.length
  if (delta > 0) {
    for (; delta > 0; delta--) {
      const vNode = oldVDOM[oldVDOM.length - delta]
      vNode.node.parentNode.removeChild(vNode.node)
    }
  }

  // Update existing and new nodes, recursively
  nextVDOM.forEach((node, index) => {
    const oldVNodeChild = oldVDOM[index]
    const nextVNodeChild = nextVDOM[index]

    // 1. Create and append new children
    if (!oldVNodeChild) {
      return root.appendChild(createElement(nextVNodeChild))
    }

    // 2. If element is not the same type, rebuild it
    if (nextVNodeChild.type !== oldVNodeChild.type) {
      return oldVNodeChild.node.parentNode.replaceChild(
        createElement(nextVNodeChild),
        oldVNodeChild.node
      )
    }

    // 3. Update attributes
    diffAttributes(nextVNodeChild, oldVNodeChild)

    // 4. Update content
    if (
      nextVNodeChild.content &&
      nextVNodeChild.content !== oldVNodeChild.content
    ) {
      oldVNodeChild.node.textContent = nextVNodeChild.content
    }

    // 5a. Remove stale child nodes
    if (oldVNodeChild.children.length > 0 && node.children.length < 1) {
      return (oldVNodeChild.node.innerHTML = "")
    }

    // 5b. Rebuild elements that are empty but shouldn't be
    //     Uses a document fragment to prevent unnecessary reflows
    if (oldVNodeChild.children.length < 1 && node.children.length > 0) {
      const fragment = document.createDocumentFragment()
      diffVDOM(node.children, oldVNodeChild.children, fragment)
      return root.appendChild(fragment)
    }

    // 5c. Diff any children of the current node.
    if (node.children.length > 0) {
      diffVDOM(node.children, oldVNodeChild.children, oldVNodeChild.node)
    }
  })
}

/**
 * Renders a vDOM into the given root element. This happens one time,
 * when a component is first rendered.
 * @param {VirtualNode[]} vDOM
 * @param {ShadowRoot} root
 */
export const renderToDOM = (vDOM, root) => {
  vDOM.forEach((vNode) => root.appendChild(vNode.node))
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
 * @param {boolean} isSVG
 * @returns {VirtualNode[]}
 */
export const createVDOM = (element, isSVG) => {
  return Array.prototype.map.call(element.childNodes, (node) => {
    const type =
      node.nodeType === 3
        ? "text"
        : node.nodeType === 8
        ? "comment"
        : node.tagName.toLowerCase()
    const attributes = node.nodeType === 1 ? getAttributes(node) : {}
    const content =
      node.childNodes && node.childNodes.length > 0 ? null : node.textContent
    const vNode = { node, content, attributes, type }

    vNode.isSVG = isSVG || vNode.type === "svg"
    vNode.children = createVDOM(node, vNode.isSVG)
    return vNode
  })
}
