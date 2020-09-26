/**
 * Sanitize a string value to remove special characters.
 * @param {string} value
 * @returns {string}
 */
export const sanitizeString = (value) => {
  const dump = document.createElement("div")
  dump.textContent = value
  return "" + dump.innerHTML
}
