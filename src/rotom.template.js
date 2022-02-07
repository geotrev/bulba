import { rotomFactory } from "./rotom-factory.js"
import { templateRenderer } from "./renderers/template/index.js"
import { createDirectionObserver } from "./observers/index.js"

createDirectionObserver()

export const RotomElement = rotomFactory(templateRenderer)
export { validateType, validateRequired } from "./properties/index.js"
export { register } from "./register.js"
