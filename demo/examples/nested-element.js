import { UpgradedElement, register } from "../../src/upgraded-element"
import "./cool-label"

class NestedElement extends UpgradedElement {
  static get styles() {
    return `
      :host {
        display: block;
      }

      .border {
        border: 1px solid lightgray;
      }
    `
  }

  render() {
    return `
      <p>This one is nested:</p>
      <div class="border">
        <cool-label first-name="Chaos" description="I'm nested!">
          <slot></slot>
        </cool-label>
      </div>
    `
  }
}

register("nested-element", NestedElement)
