/**
 * Adds custom element to the global registry.
 * @param {string} tag
 * @param {module} UpgradedInstance
 */
export const register = (tag, UpgradedInstance) => {
  if (!customElements.get(tag)) {
    customElements.define(tag, UpgradedInstance)
  }
}
