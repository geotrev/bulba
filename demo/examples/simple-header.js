import { UpgradedComponent, register } from "../../src/upgraded-component"

class SimpleHeader extends UpgradedComponent {
  static get styles() {
    return "::slotted(*) { font-weight: normal; font-family: sans-serif; }"
  }

  render() {
    return `<h1><slot></slot></h1>`
  }
}

register("simple-header", SimpleHeader)
