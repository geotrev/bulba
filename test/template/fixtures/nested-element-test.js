import "./kitchen-sink-test.js"
import { RotomElement, register } from "../rotom.js"

class NestedElementTest extends RotomElement {
  static get properties() {
    return {
      borderColor: {
        default: "lightgray",
        type: "string",
      },
      name: {
        default: "Chaos",
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

  onMount() {
    this.label = this.shadowRoot.querySelector("#clicker")
    this.label.addEventListener("click", this.handleClick)
  }

  onUnmount() {
    this.label.removeEventListener("click", this.handleClick)
  }

  getRandom(current, items) {
    const newValue = items[Math.floor(Math.random() * items.length)]
    if (newValue === current) return this.getRandom(current, items)
    return newValue
  }

  handleClick() {
    this.borderColor = this.getRandom(this.borderColor, [
      "gray",
      "blue",
      "purple",
      "lime",
      "orange",
    ])
    this.name = this.getRandom(this.name, [
      "Mario",
      "Samus",
      "Luigi",
      "C Falcon",
    ])
  }

  render() {
    return `
      <div>
        <p data-key="lede">This one is nested with inline styles.</p>
        <button data-key="updater" id="clicker">Click to update</button>
        <div data-key="nested" class="border" style="border-color: ${this.borderColor}">
          <kitchen-sink-test attribute-default="it works!" first-name="${this.name}" description="I'm nested!">
            <slot></slot>
          </kitchen-sink-test>
        </div>
      </div>
    `
  }
}

register("nested-element-test", NestedElementTest)
