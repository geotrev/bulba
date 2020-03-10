import { UpgradedComponent } from "../../src/upgraded-component"

class SimpleCompTest extends UpgradedComponent {
  render() {
    return `<h1>I'm a simple component, nothing special.</h1>`
  }
}

if (!customElements.get("simple-comp-test"))
  customElements.define("simple-comp-test", SimpleCompTest)
