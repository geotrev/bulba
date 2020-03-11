import { UpgradedComponent } from "../../src/upgraded-component"

class SimpleHeader extends UpgradedComponent {
  static get styles() {
    return "::slotted(*) { font-weight: normal; font-family: sans-serif; }"
  }

  render() {
    return `<slot name="heading"></slot>`
  }
}

if (!customElements.get("simple-header")) customElements.define("simple-header", SimpleHeader)
