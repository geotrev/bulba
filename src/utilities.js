export const createUUID = () => {
  const x = Number.MAX_SAFE_INTEGER
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Date.now()).toString(36)
}

export const toCamel = value => {
  return value.replace(/([-_][a-z])/gi, $1 =>
    $1
      .toUpperCase()
      .replace("-", "")
      .replace("_", "")
  )
}

export const toKebab = value => {
  return value.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase()
}

export const isPlainObject = value =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export const isEmptyObject = value => isPlainObject(value) && Object.keys(value).length === 0

export const isFunction = value => typeof value === "function"

export const isString = value => typeof value === "string"

export const isUndefined = value => typeof value === "undefined"

export const isSymbol = value => typeof value === "symbol"
