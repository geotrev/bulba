import { UpgradedElement, register } from "../../src"
import "./kitchen-sink-test"

class NestedElementTest extends UpgradedElement {
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
        border-width: 3px;
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
    this.borderColor = ["gray", "blue", "purple", "lime", "orange"][
      Math.floor(Math.random() * 5)
    ]
    this.shadowRoot.querySelector("kitchen-sink-test").firstName = [
      "Mario",
      "Samus",
      "Luigi",
      "C Falcon",
    ][Math.floor(Math.random() * 4)]
  }

  render() {
    return `
      <div>
        <p data-key="lede">This one is nested with inline styles.</p>
        <button data-key="updater" id="clicker">Click to update</button>
        <div data-key="nested" class="border" style="border-color: ${this.borderColor}">
          <kitchen-sink-test first-name="Chaos" description="I'm nested!">
            <slot></slot>
          </kitchen-sink-test>
        </div>
      </div>
    `
  }
}

register("nested-element-test", NestedElementTest)
