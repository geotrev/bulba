/**
 * Returns the stringified data type as given from the object tag.
 * @param {*} value
 * @returns {string}
 */
const getTypeTag = (value) =>
  Object.prototype.toString.call(value).slice(8, -1).toLowerCase()

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
