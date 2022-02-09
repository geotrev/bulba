import { RotomElement, register } from "../rotom.js"
import { Renderer, jsx } from "@rotom/jsx"

class SlotTest extends RotomElement(Renderer) {
  static get styles() {
    return `
      p { 
        font-weight: normal;
        font-family: sans-serif;
      }
    `
  }

  render() {
    return (
      <p>
        <slot></slot>
      </p>
    )
  }
}

register("slot-test", SlotTest)
