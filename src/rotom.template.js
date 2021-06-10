import "./observers"

import { rotomFactory } from "./rotom-factory"
import { renderer } from "./renderers/template"

export const Rotom = rotomFactory(renderer)
export { register } from "./register"
