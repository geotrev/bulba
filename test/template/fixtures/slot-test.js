import { RotomElement, register } from "../../../src/index.js"

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
    return `<p><slot></slot></p>`
  }
}

register("slot-test", SlotTest)
