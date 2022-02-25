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
export const isEmptyObject = (value) => {
  if (!isPlainObject(value)) return false

  for (let key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      return false
    }
  }

  return true
}

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
