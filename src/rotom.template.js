import { rotomFactory } from "./rotom-factory"
import { renderer } from "./renderers/template"
import { createDirectionObserver } from "./observers"

createDirectionObserver()

export const Rotom = rotomFactory(renderer)
export { register } from "./register"
