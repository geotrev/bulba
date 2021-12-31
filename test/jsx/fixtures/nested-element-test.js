import { jsx } from "snabbdom"
import { Rotom, register } from "../../../src/rotom.jsx"
import "./kitchen-sink-test.js"

class NestedElementTest extends Rotom {
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
    return (
      <div>
        <p>This one is nested with inline styles.</p>
        <button on={{ click: this.handleClick }}>Click to update</button>
        <div
          className="border"
          style={{
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: this.borderColor,
          }}
        >
          <kitchen-sink-test
            attrs={{ "first-name": "Chaos", description: "I'm nested!" }}
          >
            <slot></slot>
          </kitchen-sink-test>
        </div>
      </div>
    )
  }
}

register("nested-element-test", NestedElementTest)
