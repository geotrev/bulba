import { RotomElement, register } from "@rotom/element"
import { renderer, jsx } from "@rotom/jsx"

class SlotTest extends RotomElement(renderer) {
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
