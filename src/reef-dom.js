/**
 * Credit for this approach goes to Chris Ferdinandi.
 * It's basically the same as reefjs, but has renamed vars,
 * supports es6, and includes more methods for upgrade-element's
 * specific use-case..
 * https://github.com/cferdinandi/reef
 */

const dynamicAttributes = ["checked", "selected", "value"]

const getElementStyles = styles => {
  return styles.split(";").map(style => {
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

const removeElementStyles = (element, styles) => {
  styles.forEach(style => (element.style[style.name] = ""))
}

const addElementStyles = (element, styles) => {
  styles.forEach(style => (element.style[style.name] = style.value))
}

const diffElementStyles = (element, styles) => {
  // Get style map
  const vNodeStyles = getElementStyles(styles)

  // Get styles to remove
  const vNodeStaleStyles = Array.prototype.filter.call(element.style, style => {
    const findStyle = vNodeStyles.find(newStyle => {
      return newStyle.name === style && newStyle.value === element.style[style]
    })
    return findStyle === undefined
  })

  // Apply changes
  removeElementStyles(element, vNodeStaleStyles)
  addElementStyles(element, vNodeStyles)
}

const removeElementAttributes = (element, attributes) => {
  attributes.forEach(attribute => {
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
 * Sets new attributes, styles, and classNames
 * @param {HTMLElement} element
 * @param {Array} attributes
 */
const addElementAttributes = (element, attributes) => {
  attributes.forEach(attribute => {
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
 * @param {Object} vNode
 */
const createElement = vNode => {
  let node
  if (vNode.type === "text") {
    node = document.createTextNode(vNode.content)
  } else if (vNode.type === "comment") {
    node = document.createComment(vNode.content)
  } else if (vNode.isSVG) {
    node = document.createElementNS("http://www.w3.org/2000/svg", vNode.type)
  } else {
    node = document.createElement(vNode.type)
  }

  addElementAttributes(node, vNode.attributes)

  if (vNode.children.length > 0) {
    vNode.children.forEach(childElement => {
      node.appendChild(createElement(childElement))
    })
  } else if (vNode.type !== "text") {
    node.textContent = vNode.content
  }

  return node
}

const getVNodeAttribute = (name, value) => {
  return { name, value }
}

const getVNodeDynamicAttributes = (vNode, attributes) => {
  dynamicAttributes.forEach(prop => {
    if (!vNode[prop]) return
    attributes.push(getVNodeAttribute(prop, vNode[prop]))
  })
}

const getVNodeBaseAttributes = vNode => {
  return Array.prototype.reduce.call(
    vNode.attributes,
    (allAttributes, attribute) => {
      if (dynamicAttributes.indexOf(attribute.name) < 0) {
        allAttributes.push(getVNodeAttribute(attribute.name, attribute.value))
      }
      return allAttributes
    },
    []
  )
}

const getVNodeAttributes = element => {
  const attributes = getVNodeBaseAttributes(element)
  getVNodeDynamicAttributes(element, attributes)

  return attributes
}

/**
 * Reconcile attributes from nextVNode to existingVNode
 * @param {Object} nextVNode
 * @param {Object} existingVNode
 */
const diffVNodeAttributes = (nextVNode, existingVNode) => {
  const removedAttributes = existingVNode.attributes.filter(attribute => {
    const newAttributes = nextVNode.attributes.find(
      newAttribute => attribute.name === newAttribute.name
    )

    return newAttributes === null
  })

  const changedAttributes = nextVNode.attributes.filter(attribute => {
    if (dynamicAttributes.indexOf(attribute.name) > -1) return false

    const newAttributes = find(
      existingVNode.attributes,
      existingAttribute => attribute.name === existingAttribute.name
    )

    return newAttributes === null || newAttributes.value !== attribute.value
  })

  // Add and remove attributes
  addElementAttributes(existingVNode.node, changedAttributes)
  removeElementAttributes(existingVNode.node, removedAttributes)
}

// Starting at the top level, recursively iterate through the new map
// and update changes to the current one if there are differences.

/**
 *
 * @param {Array} nextVDOM
 * @param {Array} oldVDOM
 * @param {HTMLElement|ShadowRoot} root
 */
const syncNodes = (nextVDOM, oldVDOM, root) => (node, index) => {
  const existingVNodeChild = oldVDOM[index]
  const nextVNodeChild = nextVDOM[index]

  // 1. Create and append new children
  if (!existingVNodeChild) {
    return root.appendChild(createElement(nextVNodeChild))
  }

  // 2. If element is not the same type, rebuild it
  if (nextVNodeChild.type !== existingVNodeChild.type) {
    return existingVNodeChild.node.parentNode.replaceChild(
      createElement(nextVNodeChild),
      existingVNodeChild.node
    )
  }

  // 3. Update attributes
  diffVNodeAttributes(nextVNodeChild, existingVNodeChild)

  // 4. Update content
  if (nextVNodeChild.content && nextVNodeChild.content !== existingVNodeChild.content) {
    existingVNodeChild.node.textContent = nextVNodeChild.content
  }

  // 5a. Remove stale child nodes
  if (existingVNodeChild.children.length > 0 && node.children.length < 1) {
    return (existingVNodeChild.node.innerHTML = "")
  }

  // 5b. Rebuild elements that are empty but shouldn't be
  //     Uses a document fragment to prevent unnecessary reflows
  if (existingVNodeChild.children.length < 1 && node.children.length > 0) {
    const fragment = document.createDocumentFragment()
    diffVDOM(node.children, existingVNodeChild.children, fragment)
    return root.appendChild(fragment)
  }

  // 5c. Diff any children of the current node.
  if (node.children.length > 0) {
    diffVDOM(node.children, existingVNodeChild.children, existingVNodeChild.node)
  }
}

/**
 * Export utilities
 */

/**
 * Reconcile nextVDOM (new render state) against oldVDOM (old render state).
 * @param {Array} nextVDOM - new virtual DOM
 * @param {Array} oldVDOM - old virtual DOM
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

  // Run the diff
  nextVDOM.forEach(syncNodes(nextVDOM, oldVDOM, root))
}

/**
 * Renders a vDOM into the given root element. This happens one time,
 * when a component is first rendered.
 * @param {Array} vDOM
 * @param {ShadowRoot} root
 */
export const renderToDOM = (vDOM, root) => {
  vDOM.forEach(vNode => root.appendChild(vNode.node))
}

/**
 * Convert stringified HTML into valid HTML, stripping all extra spaces.
 * @param {String} stringToRender
 */
export const stringToHTML = stringToRender => {
  /**
   * Remove all extraneous whitespace:
   * - From the beginning + end of the document fragment
   * - If there's more than one space before a left tag bracket, replace them with one
   * - If there's more than one space before a right tag bracket, replace them with one
   */
  const processedDOMString = stringToRender.trim().replace(/\s+</g, "<").replace(/>\s+/g, ">")

  const parser = new DOMParser()
  const context = parser.parseFromString(processedDOMString, "text/html")
  return context.body
}

/**
 * Creates a new virtual DOM from nodes within a given element.
 * @param {HTMLElement|HTMLBodyElement} element
 * @param {boolean} isSVG
 */
export const createVDOM = (element, isSVG) => {
  return Array.prototype.map.call(element.childNodes, node => {
    const type =
      node.nodeType === 3 ? "text" : node.nodeType === 8 ? "comment" : node.tagName.toLowerCase()
    const attributes = node.nodeType === 1 ? getVNodeAttributes(node) : []
    const content = node.childNodes && node.childNodes.length > 0 ? null : node.textContent
    const vNode = { node, content, attributes, type }

    vNode.isSVG = isSVG || vNode.type === "svg"
    vNode.children = createVDOM(node, vNode.isSVG)
    return vNode
  })
}
