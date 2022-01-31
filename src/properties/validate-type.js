import { log, getTypeTag } from "../utilities"

/**
 * Checks that a prop name matches its intended type.
 * @param {HTMLElement} Cls
 * @param {string} propName
 * @param {*} value
 * @param {string} type
 */
export function validateType(Cls, propName, value, type) {
  if (typeof type === "undefined") return

  const evaluatedType = getTypeTag(value)

  if (type === undefined || evaluatedType === type) return

  log(
    `Property '${propName}' is invalid type of '${evaluatedType}'. Expected '${type}'. Check ${Cls.constructor.name}.`
  )
}
