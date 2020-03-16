// Generates a unique 19 digit ID based on Date.now() and MAX_SAFE_INTEGER

export const createUUID = () => {
  const base = Number.MAX_SAFE_INTEGER
  return Math.floor(Math.random() * base).toString(36) + Math.abs(Date.now()).toString(36)
}

// Convert a PascalCase or camelCase string to kebab-case
// E.g., HelloWorld => hello-world
// E.g., greetingsEarthling => greetings-earthling

export const toKebabCase = value =>
  value &&
  value
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join("-")

// Get the type tag of a value.
// E.g., ["some", "array", 123] => [object Array] => "array"

export const getTypeTag = value =>
  Object.prototype.toString
    .call(value)
    .slice(8, -1)
    .toLowerCase()

// Type checking helpers

export const isPlainObject = value => getTypeTag(value) === "object"
export const isEmptyObject = value => !isPlainObject(value) || !Object.keys(value).length
export const isFunction = value => getTypeTag(value) === "function"
export const isString = value => getTypeTag(value) === "string"
export const isUndefined = value => getTypeTag(value) === "undefined"
export const isSymbol = value => getTypeTag(value) === "symbol"
