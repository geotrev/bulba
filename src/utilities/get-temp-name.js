/**
 * Returns a new property name for a value.
 * @param {string} name
 * @returns {string}
 */
export function getTempName(name) {
  return `__${name}_initial`
}
