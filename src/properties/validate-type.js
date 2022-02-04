import { log, getTypeTag, isUndefined } from "../utilities"

/**
 * Checks that a prop name matches its intended type.
 * @param {HTMLElement} Cls
 * @param {string} propName
 * @param {*} value
 * @param {string} type
 */
export function validateType(Cls, propName, value, type) {
  if (isUndefined(type)) return

  const evaluatedType = getTypeTag(value)

  if (evaluatedType === type) return

  log(
    `Property '${propName}' is invalid type of '${evaluatedType}'. Expected '${type}'. Check ${Cls.constructor.name}.`
  )
}
