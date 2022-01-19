import { rotomFactory } from "./rotom-factory"
import { templateRenderer } from "./renderers/template"
import { createDirectionObserver } from "./observers"

createDirectionObserver()

export const RotomElement = rotomFactory(templateRenderer)
export { register } from "./register"
export { validateType } from "./properties"
