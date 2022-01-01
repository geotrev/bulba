import { jsx } from "snabbdom"
import { Rotom, register } from "../../../src/rotom.jsx"

class CustomAccessorTest extends Rotom {
  static get properties() {
    return {
      coolText: { type: "string", default: "No cool text (yet)" },
      preventUpdates: {
        type: "boolean",
        default: false,
      },
    }
  }

  set coolText(value) {
    this._coolText = value
    this.requestRender()
  }

  get coolText() {
    return this._coolText
  }

  constructor() {
    super()
    this.handleUpdate = this.handleUpdate.bind(this)
    this.stopUpdates = this.stopUpdates.bind(this)
  }

  onMount() {
    this.coolText = "Cool"
  }

  handleUpdate() {
    if (this.preventUpdates) return
    this.coolText = this.coolText === "Cool" ? "Not Cool" : "Cool"
  }

  stopUpdates() {
    this.preventUpdates = true
  }

  render() {
    return (
      <div>
        <p key="lede">Update text with custom accessors:</p>
        <button key="update-text" on={{ click: this.handleUpdate }}>
          This is: <span key="cool-text">{this.coolText}</span>
        </button>
        <p key="stop-text">Stop updates from happening:</p>
        <button key="stop-updates" on={{ click: this.stopUpdates }}>
          Disable updates
        </button>
      </div>
    )
  }
}

register("custom-accessor-test", CustomAccessorTest)
