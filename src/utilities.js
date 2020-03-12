export const createUUID = () => {
  const x = Number.MAX_SAFE_INTEGER
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Date.now()).toString(36)
}

export const toKebabCase = value =>
  value &&
  value
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join("-")

export const isPlainObject = value =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export const isEmptyObject = value => !isPlainObject(value) || !Object.keys(value).length
export const isFunction = value => typeof value === "function"
export const isString = value => typeof value === "string"
export const isUndefined = value => typeof value === "undefined"
export const isSymbol = value => typeof value === "symbol"
