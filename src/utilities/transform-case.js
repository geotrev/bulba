/**
 * Converts a camel- or Pascal-case string to kebab-case.
 * @param {string} value
 * @returns {string}
 */
export const camelToKebab = (value) =>
  value &&
  value
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-")

/**
 * Converts a kebab-case string to camelCase.
 * @param {string} value
 * @returns {string}
 */
export const kebabToCamel = (value) =>
  value &&
  value
    .split("-")
    .map((word, i) =>
      i
        ? word[0].toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase()
    )
    .join("")
