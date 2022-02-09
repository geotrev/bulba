import { RotomElement, register } from "../rotom.js"
import { Renderer, jsx } from "@rotom/jsx"
import "./kitchen-sink-test"

class NestedElementTest extends RotomElement(Renderer) {
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
    return (
      <div>
        <p>This one is nested with inline styles.</p>
        <button on-click={this.handleClick}>Click to update</button>
        <div
          className="border"
          style={{
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: this.borderColor,
          }}
        >
          <kitchen-sink-test
            attribute-default="it works!"
            first-name={this.name}
            description="I'm nested!"
          >
            <slot></slot>
          </kitchen-sink-test>
        </div>
      </div>
    )
  }
}

register("nested-element-test", NestedElementTest)
