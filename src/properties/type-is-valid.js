import { log, getTypeTag } from "../utilities"

export function typeIsValid(Instance, propName, value, type) {
  if (process?.env?.NODE_ENV === "production") {
    return true
  }

  const evaluatedType = getTypeTag(value)

  if (type === undefined || evaluatedType === type) {
    return true
  }

  log(
    `Property '${propName}' is invalid type of '${evaluatedType}'. Expected '${type}'. Check ${Instance.constructor.name}.`
  )

  return false
}
