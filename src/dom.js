/**
 * Credit for this reactive view approach goes to Chris Ferdinandi
 * https://github.com/cferdinandi/reef
 */

const dynamicAttributes = [
  "checked",
  "disabled",
  "hidden",
  "lang",
  "readonly",
  "required",
  "selected",
  "value",
]

export const stringToHTML = domString => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(domString, "text/html")
  return doc.body
}

const getAttribute = (name, value) => {
  return {
    name: name,
    value: value,
  }
}

const getDynamicAttributes = (node, attributes) => {
  dynamicAttributes.forEach(prop => {
    if (!node[prop]) return
    attributes.push(getAttribute(prop, node[prop]))
  })
}

const getBaseAttributes = node => {
  return Array.prototype.reduce.call(
    node.attributes,
    (allAttributes, attribute) => {
      if (dynamicAttributes.indexOf(attribute.name) < 0) {
        allAttributes.push(getAttribute(attribute.name, attribute.value))
      }
      return allAttributes
    },
    []
  )
}

const getAttributes = node => {
  const attributes = getBaseAttributes(node)
  getDynamicAttributes(node, attributes)

  return attributes
}

export const createDOMMap = (element, isSVG) => {
  return Array.prototype.map.call(element.childNodes, node => {
    const type =
      node.nodeType === 3 ? "text" : node.nodeType === 8 ? "comment" : node.tagName.toLowerCase()
    const attributes = node.nodeType === 1 ? getAttributes(node) : []
    const content = node.childNodes && node.childNodes.length > 0 ? null : node.textContent
    const details = { node, content, attributes, type }

    details.isSVG = isSVG || details.type === "svg"
    details.children = createDOMMap(node, details.isSVG)
    return details
  })
}

const getStyleMap = styles => {
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

const removeStyles = (element, styles) => {
  styles.forEach(style => (element.style[style.name] = ""))
}

const changeStyles = (element, styles) => {
  styles.forEach(style => (element.style[style.name] = style.value))
}

const diffStyles = (element, styles) => {
  // Get style map
  const styleMap = getStyleMap(styles)

  // Get styles to remove
  const remove = Array.prototype.filter.call(element.style, style => {
    const findStyle = styleMap.find(newStyle => {
      return newStyle.name === style && newStyle.value === element.style[style]
    })
    return findStyle === undefined
  })

  // Apply changes
  removeStyles(element, remove)
  changeStyles(element, styleMap)
}

const removeAttributes = (element, attributes) => {
  attributes.forEach(attribute => {
    // If the attribute is `class` or `style`,
    // unset the properties.
    if (attribute.name === "class") {
      element.className = ""
    } else if (attribute.name === "style") {
      removeStyles(element, Array.prototype.slice.call(element.style))
    } else {
      // If the attribute is also a property, unset it
      if (attribute.name in element) {
        element[attribute.name] = ""
      }
      element.removeAttribute(attribute.name)
    }
  })
}

const addAttributes = (element, attributes) => {
  attributes.forEach(attribute => {
    // If the attribute is `class` or `style`,
    // apply those as properties.
    if (attribute.name === "class") {
      element.className = attribute.value
    } else if (attribute.name === "style") {
      diffStyles(element, attribute.value)
    } else {
      // If the attribute is also a property, set it
      if (attribute.name in element) {
        element[attribute.name] = attribute.value || attribute.name
      }
      element.setAttribute(attribute.name, attribute.value || "")
    }
  })
}

const createNode = element => {
  let node
  if (element.type === "text") {
    node = document.createTextNode(element.content)
  } else if (element.type === "comment") {
    node = document.createComment(element.content)
  } else if (element.isSVG) {
    node = document.createElementNS("http://www.w3.org/2000/svg", element.type)
  } else {
    node = document.createElement(element.type)
  }

  addAttributes(node, element.attributes)

  if (element.children.length > 0) {
    element.children.forEach(childElement => {
      node.appendChild(createNode(childElement))
    })
  } else if (element.type !== "text") {
    node.textContent = element.content
  }

  return node
}

const diffAttributes = (template, existing) => {
  const removedAttributes = existing.attributes.filter(attribute => {
    const newAttributes = template.attributes.find(newAttribute => {
      return attribute.name === newAttribute.name
    })

    return newAttributes === null
  })

  const changedAttributes = template.attributes.filter(attribute => {
    const newAttributes = find(existing.attributes, existingAttribute => {
      return attribute.name === existingAttribute.name
    })

    return newAttributes === null || newAttributes.value !== attribute.value
  })

  addAttributes(existing.node, changedAttributes)
  removeAttributes(existing.node, removedAttributes)
}

// Starting at the top level, recursively iterate through the new map
// and update changes to the current one if there are differences.

const syncTemplateToMap = (templateMap, domMap, element) => (node, index) => {
  const existingChildNode = domMap[index]
  const templateChildNode = templateMap[index]

  // 1. Create and append new children
  if (!existingChildNode) {
    return element.appendChild(createNode(templateChildNode))
  }

  // 2. If element is not the same type, rebuild it
  if (templateChildNode.type !== existingChildNode.type) {
    return existingChildNode.node.parentNode.replaceChild(
      createNode(templateChildNode),
      existingChildNode.node
    )
  }

  // 3. Update attributes
  diffAttributes(templateChildNode, existingChildNode)

  // 4. Update content
  if (templateChildNode.content && templateChildNode.content !== existingChildNode.content) {
    existingChildNode.node.textContent = templateChildNode.content
  }

  // 5a. Remove stale child nodes
  if (existingChildNode.children.length > 0 && node.children.length < 1) {
    return (existingChildNode.node.innerHTML = "")
  }

  // 5b. Rebuild elements that are empty but shouldn't be
  //     Uses a document fragment to prevent unnecessary reflows
  if (existingChildNode.children.length < 1 && node.children.length > 0) {
    const fragment = document.createDocumentFragment()
    diffDOM(node.children, existingChildNode.children, fragment)
    return element.appendChild(fragment)
  }

  // 5c. Diff any children of the current node.
  if (node.children.length > 0) {
    diffDOM(node.children, existingChildNode.children, existingChildNode.node)
  }
}

export const diffDOM = (templateMap, domMap, element) => {
  // Remove missing children from map
  let delta = domMap.length - templateMap.length
  if (delta > 0) {
    for (; delta > 0; delta--) {
      const child = domMap[domMap.length - delta]
      child.node.parentNode.removeChild(child.node)
    }
  }

  // Diff it
  templateMap.forEach(syncTemplateToMap(templateMap, domMap, element))
}

export const renderMapToDOM = (templateMap, root) => {
  templateMap.forEach(element => root.appendChild(element.node))
}
