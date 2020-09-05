/**
 * Credit for this approach goes to Chris Ferdinandi.
 * It's basically the same as reefjs, but has renamed vars,
 * supports es6, and includes more methods for upgrade-element's
 * specific use-case..
 * https://github.com/cferdinandi/reef
 */

/**
 * An object whose key/value pairs are the name and value of an attribute, respectively.
 * @typedef Attribute
 * @type {Object}
 * @property {string} name
 * @property {string} value
 */

/**
 * Object representation of a DOM element.
 * @typedef VirtualNode
 * @type {Object}
 * @property {string} type - The type of node. E.g., tag name, "comment", or "text".
 * @property {Attribute[]} attributes - List of attributes, if any.
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
 * Returns the first item in an array that satisfies
 * the callback condition
 */
const find = (arr, callback) => {
  var matches = arr.filter(callback)
  if (matches.length < 1) return null
  return matches[0]
}

/**
 * Takes an inline style string and reduces it to
 * an array of objects per prop/value pair.
 * @param {string} styles
 * @returns {Attribute[]}
 */
const getElementStyles = (styles) => {
  return styles.split(";").map((style) => {
    const entry = style.trim()

    if (entry.indexOf(":") > 0) {
      const [name, value] = entry.split(":")

      return {
        name: name ? name.trim() : "",
        value: value ? value.trim() : "",
      }
    }
  })
}

/**
 * Removes inline styles from the element.
 * @param {HTMLElement} element
 * @param {Attribute[]} styles
 */
const removeElementStyles = (element, styles) => {
  styles.forEach((style) => (element.style[style.name] = ""))
}

/**
 * Adds inline styles to the element.
 * @param {HTMLElement} element
 * @param {Attribute[]} styles
 */
const addElementStyles = (element, styles) => {
  styles.forEach((style) => (element.style[style.name] = style.value))
}

/**
 * Updates styles on element: removes missing, updates existing if changed.
 * @param {HTMLElement} element
 * @param {string} styles
 */
const diffElementStyles = (element, styles) => {
  // Get style map
  const styleMap = getElementStyles(styles)

  // Get styles to remove
  const staleStyles = Array.prototype.filter.call(element.style, (style) => {
    const findStyle = find(styleMap, (newStyle) => {
      return newStyle.name === style && newStyle.value === element.style[style]
    })

    return findStyle === null
  })

  // Apply changes
  removeElementStyles(element, staleStyles)
  addElementStyles(element, styleMap)
}

/**
 * Removes stale attributes from the element.
 * @param {HTMLElement} element
 * @param {Attribute[]} attributes
 */
const removeElementAttributes = (element, attributes) => {
  attributes.forEach((attribute) => {
    // If the attribute is `class` or `style`,
    // unset the properties.
    if (attribute.name === "class") {
      element.className = ""
    } else if (attribute.name === "style") {
      removeElementStyles(element, Array.prototype.slice.call(element.style))
    } else {
      // If the attribute is also a property, unset it
      if (attribute.name in element) {
        element[attribute.name] = ""
      }
      element.removeAttribute(attribute.name)
    }
  })
}

/**
 * Adds attributes to the element.
 * @param {HTMLElement} element
 * @param {Attribute[]} attributes
 */
const addElementAttributes = (element, attributes) => {
  attributes.forEach((attribute) => {
    // If the attribute is `class` or `style`,
    // apply those as properties.
    if (attribute.name === "class") {
      element.className = attribute.value
    } else if (attribute.name === "style") {
      diffElementStyles(element, attribute.value)
    } else {
      // If the attribute is also a property, set it
      if (attribute.name in element) {
        element[attribute.name] = attribute.value || attribute.name
      }
      element.setAttribute(attribute.name, attribute.value || "")
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

  addElementAttributes(element, vNode.attributes)

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
 * Create an attribute name/value object.
 * @param {string} name
 * @param {string} value
 * @returns {Attribute}
 */
const getVNodeAttribute = (name, value) => {
  return { name, value }
}

/**
 * Gets dynamic property-based attributes to be applied.
 * @param {HTMLElement} element
 * @param {Attribute[]} attributes
 */
const getVNodeDynamicAttributes = (element, attributes) => {
  dynamicAttributes.forEach((prop) => {
    if (!element[prop]) return
    attributes.push(getVNodeAttribute(prop, element[prop]))
  })
}

/**
 * Gets non-dynamic node attributes to be applied.
 * @param {HTMLElement} element
 * @returns {Attribute[]}
 */
const getVNodeBaseAttributes = (element) => {
  return Array.prototype.reduce.call(
    element.attributes,
    (allAttributes, attribute) => {
      if (dynamicAttributes.indexOf(attribute.name) < 0) {
        allAttributes.push(getVNodeAttribute(attribute.name, attribute.value))
      }
      return allAttributes
    },
    []
  )
}

/**
 * Gets all virtual node attributes.
 * @returns {Attribute[]}
 */
const getVNodeAttributes = (element) => {
  const attributes = getVNodeBaseAttributes(element)
  getVNodeDynamicAttributes(element, attributes)

  return attributes
}

/**
 * Reconcile attributes from oldVNode to nextVNode
 * @param {VirtualNode} nextVNode
 * @param {VirtualNode} oldVNode
 */
const diffVNodeAttributes = (nextVNode, oldVNode) => {
  // Get stale attributes
  const removedAttributes = oldVNode.attributes.filter((oldAtt) => {
    const getAtt = find(nextVNode.attributes, (newAtt) => {
      return oldAtt.name === newAtt.name
    })

    return getAtt === null
  })

  // Get changed or new attributes
  const changedAttributes = nextVNode.attributes.filter((newAtt) => {
    const getAtt = find(oldVNode.attributes, (oldAtt) => {
      return newAtt.name === oldAtt.name
    })
    return getAtt === null || getAtt.value !== newAtt.value
  })

  // Add and remove attributes
  addElementAttributes(oldVNode.node, changedAttributes)
  removeElementAttributes(oldVNode.node, removedAttributes)
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
    diffVNodeAttributes(nextVNodeChild, oldVNodeChild)

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
    const attributes = node.nodeType === 1 ? getVNodeAttributes(node) : []
    const content =
      node.childNodes && node.childNodes.length > 0 ? null : node.textContent
    const vNode = { node, content, attributes, type }

    vNode.isSVG = isSVG || vNode.type === "svg"
    vNode.children = createVDOM(node, vNode.isSVG)
    return vNode
  })
}
