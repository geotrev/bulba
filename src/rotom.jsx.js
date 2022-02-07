import { rotomFactory } from "./rotom-factory.js"
import { jsxRenderer } from "./renderers/jsx/index.js"
import { createDirectionObserver } from "./observers/index.js"

createDirectionObserver()

export const RotomElement = rotomFactory(jsxRenderer)
export { validateType, validateRequired } from "./properties/index.js"
export { register } from "./register.js"
