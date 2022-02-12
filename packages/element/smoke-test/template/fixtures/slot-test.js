import { BulbaElement, register } from "../bulba.js"
import { Renderer } from "@bulba/template"

class SlotTest extends BulbaElement(Renderer) {
  static get styles() {
    return `
      p { 
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
