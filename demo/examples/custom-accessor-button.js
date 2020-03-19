import { UpgradedElement, register } from "../../src/upgraded-element"

class CustomAccessorButton extends UpgradedElement {
  static get properties() {
    return {
      text: { type: "string" },
    }
  }

  set text(value) {
    this._text = value

    // Uncomment to get the setter to update view
    // this.requestRender()
  }

  get text() {
    return this._text
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  elementDidMount() {
    this.text = "Cool"
    this.button = this.shadowRoot.querySelector("button")
    this.button.addEventListener("click", this.handleClick)
  }

  elementWillUnmount() {
    this.button.removeEventListener("click", this.handleClick)
  }

  handleClick() {
    this.text = this.text === "Cool" ? "Not Cool" : "Cool"
  }

  render() {
    return `
      <p>Pressing this won't do anything:</p>
      <button>This is: <span id='text'>${this.text || "(uh oh, no text)"}</span></button>
    `
  }
}

register("custom-accessor-button", CustomAccessorButton)
