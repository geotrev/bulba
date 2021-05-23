/**
 * Adds custom element to the global registry.
 * @param {string} tag
 * @param {module} RotomInstance
 */
export const register = (tag, RotomInstance) => {
  if (!customElements.get(tag)) {
    customElements.define(tag, RotomInstance)
  }
}
