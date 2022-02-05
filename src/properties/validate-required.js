import { log, isUndefined } from "../utilities"

/**
 * Checks that required props have values in development.
 * @param {string} name
 * @param {*} value
 * @param {string} type
 * @param {boolean} required
 */
export function validateRequired(name, value, type, required) {
  if (!required) return

  if (isUndefined(value)) {
    if (isUndefined(type)) {
      log(`Property '${name}' is required.`, "error")
    } else {
      log(`Property '${name}' of type '${type}' is required.`, "error")
    }
  }
}
