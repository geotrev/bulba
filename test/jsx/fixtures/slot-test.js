import { jsx } from "snabbdom"
import { RotomElement, register } from "../rotom.js"

class SlotTest extends RotomElement {
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
