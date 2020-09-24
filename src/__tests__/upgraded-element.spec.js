import { UpgradedElement, register } from "../"

window.requestAnimationFrame = jest.fn().mockImplementation((fn) => fn())
window.cancelAnimationFrame = jest.fn().mockImplementation((fn) => fn())

function mount() {
  class TestElement extends UpgradedElement {
    constructor() {
      super()
    }
  }

  register("test-element", TestElement)
}

describe("UpgradedElement", () => {
  it("initializes element", () => {
    mount()
    expect(customElements.get("test-element")).toBeTruthy()
  })
})
