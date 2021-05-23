import { jsx } from "snabbdom"
import { Rotom, register, JSX } from "../../../src/index.js"
// const { Rotom, register, JSX } = window.Rotom

class SlotTest extends Rotom {
  static get styles() {
    return `
      ::slotted(*) { 
        font-weight: normal;
        font-family: sans-serif;
      }
    `
  }

  static get renderer() {
    return JSX
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
