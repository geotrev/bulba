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
      <h1>
        <slot></slot>
      </h1>
    )
  }
}

register("slot-test", SlotTest)
