import { UpgradedElement, register } from "../../src/upgraded-element"

class SimpleHeader extends UpgradedElement {
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

register("simple-header", SimpleHeader)
