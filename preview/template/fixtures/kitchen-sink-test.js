import { BulbaElement, register } from "@bulba/element"
import { Renderer } from "@bulba/template"

export class KitchenSinkTest extends BulbaElement(Renderer) {
  static get properties() {
    return {
      firstName: {
        type: "string",
        default: (element) => element.getAttribute("first-name"),
        reflected: true,
      },
      dataAttr: {
        type: "string",
        default: (element) =>
          `data-removes='${element.getAttribute("first-name")}'`,
      },
      changeCount: {
        type: "number",
        default: 0,
      },
      highlight: {
        type: "string",
        default: "color: white; background-color: blue",
      },
      safeString: {
        type: "string",
        default: "<script>;(function(){console.log('sanitized')})()</script>",
        safe: true,
      },
      attributeDefault: { reflected: true },
    }
  }

  static get styles() {
    return `:host { display: block; } .compliments { font-weight: bold; }`
  }

  constructor() {
    super()
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleRemoveHL = this.handleRemoveHL.bind(this)
    this.handleRemoveAttr = this.handleRemoveAttr.bind(this)
  }

  onMount() {
    this.changeNameButton = this.shadowRoot.querySelector("#update-name-btn")
    this.removeHighlightsButton =
      this.shadowRoot.querySelector("#update-hl-btn")
    this.removeAttributeButton =
      this.shadowRoot.querySelector("#update-attr-btn")
    this.changeNameButton.addEventListener("click", this.handleNameChange)
    this.removeHighlightsButton.addEventListener("click", this.handleRemoveHL)
    this.removeAttributeButton.addEventListener("click", this.handleRemoveAttr)
  }

  onUnmount() {
    this.changeNameButton.removeEventListener("click", this.handleNameChange)
    this.removeHighlightsButton.removeEventListener(
      "click",
      this.handleRemoveHL
    )
    this.removeAttributeButton.removeEventListener(
      "click",
      this.handleRemoveAttr
    )
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

  handleNameChange() {
    this.changeCount = this.changeCount + 1
    const newName = this.getNewName()
    const [text, bg] = this.getHighlight()

    this.dataAttr = `data-removes='${newName}'`
    this.highlight = `color: ${text}; background-color: ${bg}`
    this.firstName = newName
  }

  handleRemoveHL() {
    if (!this.highlight) return
    this.highlight = ""
  }

  handleRemoveAttr() {
    if (!this.dataAttr) return
    this.dataAttr = ""
  }

  render() {
    const intermittentNode =
      this.dataAttr === "" ? "<div data-key='rem'>Removed attribute</div>" : ""
    return `
      <div>
        <p data-key="lede" style="${this.highlight}">
          You've changed names ${this.changeCount} times
        </p>
        <p data-key="comp" class="compliments" ${this.dataAttr} data-empty="${
      this.dataAttr
    }">You're awesome, ${this.firstName}!</p>
        <p data-key='desc'>${this.getAttribute("description")}</p>
        ${intermittentNode}
        <p data-key="safe">Sanitized content: ${this.safeString}</p>
        <p key="attr-default">Attribute set to prop: ${
          this.attributeDefault
        }</p>
        <button data-key="name-btn" id="update-name-btn">Change Name</button>
        <button data-key="hl-btn" id="update-hl-btn">Remove Highlights</button>
        <button data-key="attr-btn" id="update-attr-btn">Remove Attribute</button>
        <slot data-key="slot"></slot>
      </div>
    `
  }
}

register("kitchen-sink-test", KitchenSinkTest)
