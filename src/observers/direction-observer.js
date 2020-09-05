/**
 * Search for other upgraded elements, denoted by the
 * presence of `element-id` on the element, and update
 * its document direction.
 * @param {HTMLElement|ShadowRoot} context
 */
const updateDirection = (context = document) => {
  const nodes = context.querySelectorAll("[element-id]")
  if (!nodes.length) return

  nodes.forEach((node) => {
    node.setAttribute("dir", String(document.dir || "ltr"))

    if (node.shadowRoot) {
      updateDirection(node.shadowRoot)
    }
  })
}

const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "dir") {
      updateDirection()
    }
  })
})

mutationObserver.observe(document.documentElement, { attributes: true })
