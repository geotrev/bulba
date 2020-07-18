import { UpgradedElement, register } from "../../src"

export class ReflectPropertiesTest extends UpgradedElement {
  static get properties() {
    return {
      firstName: {
        type: "string",
        default: element => element.getAttribute("first-name"),
        reflected: true,
      },
      changeCount: {
        type: "number",
        default: 0,
      },
    }
  }

  static get styles() {
    return `:host { display: block; } .compliments { font-weight: bold; }`
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  elementDidMount() {
    this.button = this.shadowRoot.querySelector("#update-btn")
    this.button.addEventListener("click", this.handleClick)
  }

  elementWillUnmount() {
    this.button.removeEventListener("click", this.hnadleClick)
  }

  render() {
    return `
      <p style="background-color: ${this.getRandomBG}; color: ${this.getRandomColor}">
        You've changed names ${this.changeCount} times
      </p>
      <p class="compliments" data-select="${this.firstName}">You're awesome, ${this.firstName}!</p>
      <p>${this.getAttribute("description")}</p>
      <button id="update-btn">Change Name</button>
      <slot></slot>
    `
  }

  getNewName() {
    const names = ["Sonic", "Knuckles", "Tails", "Eggman", "Shadow"]
    const newName = names[Math.floor(Math.random() * names.length)]
    if (newName === this.firstName) return this.getNewName()
    return newName
  }

  handleClick() {
    this.changeCount = this.changeCount + 1
    this.firstName = this.getNewName()
  }

  get getRandomBG() {
    return ["darkorange", "blue", "darkblue", "green", "purple"][Math.floor(Math.random() * 5)]
  }

  get getRandomColor() {
    return ["skyblue", "lime", "white"][Math.floor(Math.random() * 3)]
  }
}

register("reflect-properties-test", ReflectPropertiesTest)
