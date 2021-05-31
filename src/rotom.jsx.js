import "./observers"

import { rotomFactory } from "./rotom-factory"
import { renderer } from "./renderers/jsx"

export const Rotom = rotomFactory(renderer)
export { register } from "./register"
