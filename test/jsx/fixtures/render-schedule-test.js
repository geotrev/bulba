import { jsx } from "snabbdom"
import { RotomElement, register } from "../rotom.js"

export class RenderScheduleTest extends RotomElement {
  static get properties() {
    return {
      borderColor: { default: "blue", type: "string" },
      labelColor: { default: "black", type: "string" },
      count: { default: 1, type: "number" },
    }
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  getRandomItem(items, current) {
    const item = items[Math.floor(Math.random() * items.length)]

    if (item === current) return this.getRandomItem(items, current)

    return item
  }

  handleClick() {
    const borderColor = this.getRandomItem(
      ["limegreen", "blue", "rebeccapurple", "red", "green"],
      this.borderColor
    )
    const labelColor = this.getRandomItem(
      ["darkgray", "hotpink", "black", "velvet", "orange", ""],
      this.labelColor
    )
    this.borderColor = borderColor
    this.labelColor = labelColor
    this.count += 1
  }

  render() {
    return (
      <div
        className="container"
        style={{
          borderWidth: "4px",
          borderStyle: "solid",
          borderColor: this.borderColor,
        }}
      >
        <p>Render count: {this.count}</p>
        <p className="label" style={{ color: this.labelColor }}>
          This is a scheduling test.
          <br />
          It should have one render per button press, despite having multiple
          property updates.
        </p>
        <button on-click={this.handleClick}>Click to update</button>
      </div>
    )
  }
}

register("render-schedule-test", RenderScheduleTest)
