import { Rotom } from "../../src/rotom"

class SimpleCompTest extends Rotom {
  render() {
    return `<h1>I'm a simple component, nothing special.</h1>`
  }
}

if (!customElements.get("simple-comp-test"))
  customElements.define("simple-comp-test", SimpleCompTest)
