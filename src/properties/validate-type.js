import { log, getTypeTag } from "../utilities"

export function validateType(Instance, propName, value, type) {
  if (typeof type === "undefined") return

  const evaluatedType = getTypeTag(value)

  if (type === undefined || evaluatedType === type) return

  log(
    `Property '${propName}' is invalid type of '${evaluatedType}'. Expected '${type}'. Check ${Instance.constructor.name}.`
  )
}
