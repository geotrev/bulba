import { BulbaElement, register } from "@bulba/element"
import { Renderer } from "@bulba/template"

export class RenderScheduleTest extends BulbaElement(Renderer) {
  static get properties() {
    return {
      containerBorderColor: { default: "blue", type: "string" },
      labelColor: { default: "black", type: "string" },
      count: { default: 1, type: "number" },
    }
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  onMount() {
    this.button = this.shadowRoot.querySelector("button")
    this.button.addEventListener("click", this.handleClick)
  }

  onUnmount() {
    this.button.addEventListener("click", this.handleClick)
  }

  getRandom(items) {
    return items[Math.floor(Math.random() * items.length)]
  }

  handleClick() {
    const borderColor = this.getRandom(["limegreen", "blue", "rebeccapurple"])
    const labelColor = this.getRandom(["blue", "hotpink", "black"])
    this.containerBorderColor = borderColor
    this.labelColor = labelColor
    this.count += 1
  }

  render() {
    return `
      <div class='container' style='border: 4px solid ${this.containerBorderColor}'>
        <p>Render count: ${this.count}</p>
        <p class='label' style='color: ${this.labelColor}'>
          This is a scheduling test.
          <br/>
          It should have one render per button press, despite
          having multiple property updates.
        </p>
        <button>Click to update</button>
      </div>
    `
  }
}

register("render-schedule-test", RenderScheduleTest)
