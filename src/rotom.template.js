import { createDirectionObserver } from "./observers"

import { rotomFactory } from "./rotom-factory"
import { renderer } from "./renderers/template"

createDirectionObserver

export const Rotom = rotomFactory(renderer)
export { register } from "./register"
