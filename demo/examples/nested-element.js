import { UpgradedElement, register } from "../../src/upgraded-element"
import "./cool-label"

class NestedElement extends UpgradedElement {
  static get styles() {
    return `
      :host {
        display: block;
      }

      .border {
        border: 1px solid lightgray;
      }
    `
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  elementDidMount() {
    this.label = this.shadowRoot.querySelector("cool-label")
    this.label.addEventListener("click", this.handleClick)
  }

  handleClick() {
    // Why doesn't this get the right DOM state, even though `cool-label`
    // has already been updated?
    this.requestRender()
  }

  render() {
    return `
      <p>This one is nested:</p>
      <div class="border">
        <cool-label first-name="Chaos" description="I'm nested!">
          <slot></slot>
        </cool-label>
      </div>
    `
  }
}

register("nested-element", NestedElement)
