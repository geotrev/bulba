/**
 * Adds custom element to the global registry.
 * @param {string} tag
 * @param {module} BulbaInstance
 */
export const register = (tag, BulbaInstance) => {
  if (!customElements.get(tag)) {
    customElements.define(tag, BulbaInstance)
  }
}
