import { UpgradedElement, register } from "../../src/index.js"
// const { UpgradedElement, register } = window.UpgradedElement

class SlotTest extends UpgradedElement {
  static get styles() {
    return `
      ::slotted(*) { 
        font-weight: normal;
        font-family: sans-serif;
      }
    `
  }

  render() {
    return `<h1><slot></slot></h1>`
  }
}

register("slot-test", SlotTest)
