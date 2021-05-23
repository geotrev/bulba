import { renderer as useJsx } from "rotom-jsx"
import { renderer as useTemplate } from "rotom-template"
import * as internal from "../internal"
import * as external from "../external"

export const JSX = "RENDERER_JSX"
export const TEMPLATE = "RENDERER_TEMPLATE"
export const validRenderers = [JSX, TEMPLATE]
export const renderers = {
  [TEMPLATE]: useTemplate({ internal, external }),
  [JSX]: useJsx({ internal, external }),
}
