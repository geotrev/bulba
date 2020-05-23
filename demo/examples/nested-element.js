import { UpgradedElement, register } from "../../src/upgraded-element"
import "./cool-label"

class NestedElement extends UpgradedElement {
  static get properties() {
    return {
      borderColor: {
        default: "lightgray",
        type: "string",
      },
    }
  }

  static get styles() {
    return `
      :host {
        display: block;
      }

      .border {
        border-width: 1px;
        border-style: solid;
      }
    `
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  elementDidMount() {
    this.label = this.shadowRoot.querySelector("#clicker")
    this.label.addEventListener("click", this.handleClick)
  }

  elementWillUnmount() {
    this.label.removeEventListener("click", this.handleClick)
  }

  handleClick() {
    this.borderColor = ["gray", "blue", "purple", "lime", "orange"][Math.floor(Math.random() * 5)]
  }

  render() {
    return `
      <p>This one is nested.</p>
      <button id="clicker">Click to update</button>
      <div class="border" style='border-color: ${this.borderColor}'>
        <cool-label first-name="Chaos" description="I'm nested!">
          <slot></slot>
        </cool-label>
      </div>
    `
  }
}

register("nested-element", NestedElement)
