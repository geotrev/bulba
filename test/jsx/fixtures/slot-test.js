import { jsx } from "snabbdom"
import { Rotom, register } from "../../../src/rotom.jsx"
// const { RotomJSX: Rotom, register } = window.Rotom

class SlotTest extends Rotom {
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
