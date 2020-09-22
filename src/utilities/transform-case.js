/**
 * Converts a camel- or Pascal-case string to kebab-case.
 * @param {string} value
 * @returns {string}
 */
export const toKebabCase = (value) =>
  value &&
  value
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-")
