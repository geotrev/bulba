/**
 * Generates a unique 19 digit ID based on Date.now() and MAX_SAFE_INTEGER
 * @returns {string}
 */
export const createUUID = () => {
  const base = Number.MAX_SAFE_INTEGER
  return (
    Math.floor(Math.random() * base).toString(36) +
    Math.abs(Date.now()).toString(36)
  )
}

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

/**
 * Returns the stringified data type as given from the object tag.
 * @param {*} value
 * @returns {string}
 */
export const getTypeTag = (value) =>
  Object.prototype.toString.call(value).slice(8, -1).toLowerCase()

/**
 * Checks if the value is an object literal.
 * @param {*} value
 * @returns {boolean}
 */
export const isPlainObject = (value) => getTypeTag(value) === "object"

/**
 * Checks if the value is an object literal with no enumerable properties.
 * @param {*} value
 * @returns {boolean}
 */
export const isEmptyObject = (value) =>
  !isPlainObject(value) || !Object.keys(value).length

/**
 * Checks if the value is a function.
 * @param {*} value
 * @returns {boolean}
 */
export const isFunction = (value) => getTypeTag(value) === "function"

/**
 * Checks if the value is a string literal.
 * @param {*} value
 * @returns {boolean}
 */
export const isString = (value) => getTypeTag(value) === "string"

/**
 * Checks if the value is undefined.
 * @param {*} value
 * @returns {boolean}
 */
export const isUndefined = (value) => getTypeTag(value) === "undefined"

/**
 * Checks if the value is a symbol.
 * @param {*} value
 * @returns {boolean}
 */
export const isSymbol = (value) => getTypeTag(value) === "symbol"
