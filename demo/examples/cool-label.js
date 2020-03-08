import { Rotom } from "../../src/rotom"

class CoolLabel extends Rotom {
  // Setup and base component-dependent upgrades
  static get observedAttributes() {
    return ["first-name"]
  }

  static get properties() {
    return {
      firstName: {
        type: "string",
        reflected: true, // Wouldn't this be nice? :(
        initialValue: "Kelso",
      },
      changeCount: {
        type: "number",
        initialValue: 0,
      },
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.handleClick = this.handleClick.bind(this)
    const button = this.shadowRoot.querySelector("#update-btn")
    button.addEventListener("click", this.handleClick)
  }

  styles() {
    return `:host { display: block; } .compliments { font-weight: bold; }`
  }

  // component-specific stuff

  getNewName() {
    const names = ["Perry", "JD", "Elliot", "Chris", "Carla"]
    const newName = names[Math.floor(Math.random() * names.length)]
    if (newName === this.firstName) return this.getNewName()

    return newName
  }

  handleClick() {
    this.changeCount = this.changeCount + 1
    this.firstName = this.getNewName()

    // if there's no observedAttributes, use this:
    // this.requestRender()
  }

  get getRandomBG() {
    return ["mustard", "blue", "darkblue", "green", "purple"][Math.floor(Math.random() * 5)]
  }

  get getRandomColor() {
    return ["skyblue", "lime", "white"][Math.floor(Math.random() * 3)]
  }

  render() {
    return `
      <p style="background-color: ${this.getRandomBG}; color: ${this.getRandomColor}">
        You've changed names ${this.changeCount} times
      </p>
      <p class="compliments" data-select="${this.firstName}">You're awesome, ${this.firstName}!</p>
      <button id="update-btn">Change Name</button>
    `
  }
}

customElements.define("cool-label", CoolLabel)
