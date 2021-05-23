import { Rotom, register } from "../../../src/index.js"
// const { Rotom, register } = window.Rotom

class CustomAccessorTest extends Rotom {
  static get properties() {
    return {
      text: { type: "string" },
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
    this.handleCancel = this.handleCancel.bind(this)
  }

  elementDidMount() {
    this.text = "Cool"
    this.button = this.shadowRoot.querySelector("#update")
    this.button.addEventListener("click", this.handleUpdate)
    this.cancelButton = this.shadowRoot.querySelector("#cancel-updates")
    this.cancelButton.addEventListener("click", this.handleCancel)
  }

  elementWillUnmount() {
    this.button.removeEventListener("click", this.handleUpdate)
    this.cancelButton.removeEventListener("click", this.handleCancel)
  }

  handleUpdate() {
    if (this.preventUpdates) return
    this.text = this.text === "Cool" ? "Not Cool" : "Cool"
  }

  handleCancel() {
    this.preventUpdates = true
  }

  render() {
    return `
      <div>
        <p data-key="lede">Update text with custom accessors:</p>
        <button data-key="update-text" id="update">This is:&nbsp;<span data-key="cool-text" id='text'>${
          this.text || "(uh oh, no text)"
        }</span></button>
        <p data-key="stop-text">Stop updates from happening:</p>
        <button data-key="stop-updates" id="cancel-updates">Disable updates</button>
      </div>
    `
  }
}

register("custom-accessor-test", CustomAccessorTest)
