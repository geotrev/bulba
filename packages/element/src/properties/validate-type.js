import { log, getTypeTag, isUndefined } from "@bulba/utils"

/**
 * Checks that a prop name matches its intended type in development.
 * @param {string} name
 * @param {*} value
 * @param {string} type
 */
export function validateType(name, value, type) {
  if (isUndefined(type)) return

  const evaluatedType = getTypeTag(value)
  if (evaluatedType !== type) {
    log(`Property '${name}' is type '${evaluatedType}', expected '${type}'.`)
  }
}
