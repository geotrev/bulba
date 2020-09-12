import { UpgradedElement, register } from "../../src"

class CustomAccessorTest extends UpgradedElement {
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
        <p key="lede">Update text with custom accessors:</p>
        <button key="update-text" id="update">This is:&nbsp;<span key="cool-text" id='text'>${
          this.text || "(uh oh, no text)"
        }</span></button>
        <p key="stop-text">Stop updates from happening:</p>
        <button key="stop-updates" id="cancel-updates">Disable updates</button>
      </div>
    `
  }
}

register("custom-accessor-test", CustomAccessorTest)
