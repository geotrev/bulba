import { register } from "../register"

class RegisterTest extends HTMLElement {}
const EXCEPTION_MESSAGE =
  "This name has already been registered in the registry."

describe("register()", () => {
  it("registers a custom element", () => {
    register("register-test", RegisterTest)
    expect(customElements.get("register-test")).toBeTruthy()
  })

  it("doesn't attempt to register if custom element is already defined", () => {
    expect(() => register("register-test", RegisterTest)).not.toThrow(
      new Error(EXCEPTION_MESSAGE)
    )
  })
})
