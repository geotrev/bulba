import { rotomFactory } from "./rotom-factory"
import { renderer } from "./renderers/template"
import { createDirectionObserver } from "./observers"

createDirectionObserver()

export const RotomElement = rotomFactory(renderer)
export { register } from "./register"
export { validateType } from "./properties"
