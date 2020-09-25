import { basicFixture } from "./helpers/basic-fixture"
import { accessorFixture } from "./helpers/accessor-fixture"
import { getElement } from "./helpers/get-element"

window.requestAnimationFrame = jest.fn().mockImplementation((fn) => fn())
window.cancelAnimationFrame = jest.fn().mockImplementation((fn) => fn())

describe.only("UpgradedElement", () => {
  afterEach(() => (document.innerHTML = ""))

  it("upgrades the element", () => {
    // Given
    basicFixture("upgraded")
    // Then
    expect(getElement("upgraded", false).hasAttribute("element-id")).toBe(true)
  })

  it("creates a shadow root", () => {
    // Given
    basicFixture("creates-shadow")
    // Then
    expect(getElement("creates-shadow").shadowRoot).not.toBeNull()
  })

  it("renders styles to shadow root", () => {
    // Given
    const styles = "div { display: block; }"
    basicFixture("styles", { styles })
    // Then
    expect(getElement("styles").querySelector("style")).not.toBeNull()
    expect(getElement("styles").querySelector("style").textContent).toEqual(
      styles
    )
  })

  it("assigns slots, if given", () => {
    // Given
    const slotName = "main"
    basicFixture("slotted", {
      slotName,
      content: `<slot name='main'></slot>`,
    })
    // Then
    expect(
      getElement("slotted").querySelector("slot").assignedNodes()
    ).toHaveLength(1)
  })

  describe("properties", () => {
    it("sets static properties to observedAttributes", () => {})

    it("upgrades properties", () => {
      // Given
      const properties = {
        testProp1: { default: "foo" },
      }
      basicFixture("props", { properties })
      // Then
      expect(getElement("props", false).testProp1).toEqual(
        properties.testProp1.default
      )
    })

    it("re-renders view if value changes", () => {
      // Given
      const properties = {
        testProp1: { default: "foo" },
      }
      const nextValue = "bar"
      basicFixture("val-change", { properties })
      // When
      getElement("val-change", false).testProp1 = nextValue
      // Then
      expect(getElement("val-change", false).testProp1).toEqual(nextValue)
      expect(getElement("val-change").querySelector("div").textContent).toEqual(
        nextValue
      )
    })

    it("doesn't upgrade properties if accessors already exist", () => {
      // Given
      accessorFixture("no-upgrade")
      // Then
      expect(getElement("no-upgrade", false).count).toEqual(1)
    })

    describe("warnings", () => {
      /* eslint-disable no-console */
      console.warn = jest.fn()
      const warningMessage = `[UpgradedElement]: Property 'testProp1' is invalid type of 'string'. Expected 'boolean'. Check TestElement.`

      it("will print warning on upgrade if assigned type doesn't match", () => {
        // Given
        const properties = {
          testProp1: {
            type: "boolean",
            default: "foo",
          },
        }
        basicFixture("upgrade-warn", { properties })
        // Then
        expect(console.warn).toBeCalledWith(warningMessage)
      })

      it("will print warning on value change if assigned type doesn't match", () => {
        // Given
        const properties = {
          testProp1: {
            type: "boolean",
            default: true,
          },
        }
        basicFixture("change-warn", { properties })
        // When
        getElement("change-warn", false).testProp1 = "foo"
        // Then
        expect(console.warn).toBeCalledWith(warningMessage)
      })

      console.warn.mockClear()
      /* eslint-enable no-console */
    })
  })
})
