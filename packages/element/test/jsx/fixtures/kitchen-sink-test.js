import { jsx } from "snabbdom"
import { Rotom, register, JSX } from "../../../src/index.js"
// const { Rotom, register, JSX } = window.Rotom

export class KitchenSinkTest extends Rotom {
  static get properties() {
    return {
      firstName: {
        type: "string",
        default: (element) => element.getAttribute("first-name"),
        reflected: true,
      },
      dataAttr: {
        type: "object",
        default: (element) => ({
          "data-removes": element.getAttribute("first-name"),
        }),
      },
      changeCount: {
        type: "number",
        default: 0,
      },
      highlight: {
        type: "object",
        default: { color: "white", backgroundColor: "blue" },
      },
      safeString: {
        type: "string",
        default: "<script>;(function(){console.log('sanitized')})()</script>",
        safe: true,
      },
    }
  }

  static get styles() {
    return `:host { display: block; } .compliments { font-weight: bold; }`
  }

  static get renderer() {
    return JSX
  }

  constructor() {
    super()
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleRemoveHighlight = this.handleRemoveHighlight.bind(this)
    this.handleRemoveAttr = this.handleRemoveAttr.bind(this)
  }

  getNewName() {
    const newName = this.getRandom([
      "Sonic",
      "Knuckles",
      "Tails",
      "Eggman",
      "Shadow",
    ])
    if (newName === this.firstName) return this.getNewName()
    return newName
  }

  handleNameChange() {
    this.changeCount = this.changeCount + 1
    const newName = this.getNewName()
    const [text, bg] = this.getHighlight()

    this.dataAttr = { "data-removes": newName }
    this.highlight = { color: text, backgroundColor: bg }
    this.firstName = newName
  }

  handleRemoveHighlight() {
    if (!Object.keys(this.highlight).length) return
    this.highlight = {}
  }

  handleRemoveAttr() {
    if (!Object.keys(this.dataAttr).length) return
    this.dataAttr = {}
  }

  getRandom(items) {
    return items[Math.floor(Math.random() * items.length)]
  }

  getHighlight() {
    const bg = this.getRandom([
      "darkorange",
      "blue",
      "darkblue",
      "green",
      "purple",
    ])
    const text = this.getRandom(["skyblue", "lime", "white"])
    return [text, bg]
  }

  render() {
    const dataAttrHasKeys = !!Object.keys(this.dataAttr).length
    const dataEmpty = dataAttrHasKeys
      ? {
          empty: JSON.stringify(this.dataAttr),
        }
      : null

    const renderRemovedNote = !dataAttrHasKeys && (
      <div key="rem">Removed attribute</div>
    )

    return (
      <div>
        <p key="lede" style={this.highlight}>
          You've changed names {this.changeCount} times
        </p>
        <p
          key="comp"
          class={{ compliments: true, empty: dataAttrHasKeys }}
          dataset={dataEmpty}
        >
          You're awesome, {this.firstName}!
        </p>
        <p key="desc">{this.getAttribute("description")}</p>
        {renderRemovedNote}
        <p key="safe">Sanitized content: {this.safeString}</p>
        <button key="name-btn" on={{ click: this.handleNameChange }}>
          Change Name
        </button>
        <button key="hl-btn" on={{ click: this.handleRemoveHighlight }}>
          Remove Highlights
        </button>
        <button key="attr-btn" on={{ click: this.handleRemoveAttr }}>
          Remove Attribute
        </button>
        <slot key="slot" />
      </div>
    )
  }
}

register("kitchen-sink-test", KitchenSinkTest)
