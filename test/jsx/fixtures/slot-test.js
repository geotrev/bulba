import { jsx } from "snabbdom"
import { RotomElement, register } from "../../../src/rotom.jsx"

class SlotTest extends RotomElement {
  static get styles() {
    return `
      ::slotted(*) { 
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
