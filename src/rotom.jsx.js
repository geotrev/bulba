import { rotomFactory } from "./rotom-factory"
import { jsxRenderer } from "./renderers/jsx"
import { createDirectionObserver } from "./observers"

createDirectionObserver()

export const RotomElement = rotomFactory(jsxRenderer)
export { register } from "./register"
export { validateType } from "./properties"
