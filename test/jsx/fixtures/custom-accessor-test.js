import { jsx } from "snabbdom"
import { RotomElement, register } from "../../../src/rotom.jsx"

class CustomAccessorTest extends RotomElement {
  static get properties() {
    return {
      text: { type: "string", default: "THIS SHOULD NOT APPEAR" },
      preventUpdates: {
        type: "boolean",
        default: false,
      },
    }
  }

  set text(value) {
    this._text = value
    this.requestRender()
  }

  get text() {
    return this._text
  }

  constructor() {
    super()
    this.handleUpdate = this.handleUpdate.bind(this)
    this.stopUpdates = this.stopUpdates.bind(this)
  }

  onMount() {
    this.text = "Cool"
  }

  handleUpdate() {
    if (this.preventUpdates) return
    this.text = this.text === "Cool" ? "Not Cool" : "Cool"
  }

  stopUpdates() {
    this.preventUpdates = true
  }

  render() {
    return (
      <div>
        <p key="lede">Update text with custom accessors:</p>
        <button key="update-text" on-click={this.handleUpdate}>
          This is:&nbsp;{this.text || ""}
        </button>
        <p key="stop-text">Stop updates from happening:</p>
        <button key="stop-updates" on-click={this.stopUpdates}>
          Disable updates
        </button>
      </div>
    )
  }
}

register("custom-accessor-test", CustomAccessorTest)
