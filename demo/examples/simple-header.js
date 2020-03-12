import { UpgradedComponent } from "../../src/upgraded-component"

class SimpleHeader extends UpgradedComponent {
  static get styles() {
    return "::slotted(*) { font-weight: normal; font-family: sans-serif; }"
  }

  render() {
    return `<h1><slot></slot></h1>`
  }
}

if (!customElements.get("simple-header")) customElements.define("simple-header", SimpleHeader)
