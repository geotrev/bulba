import { basicFixture } from "./helpers/basic-fixture"
import { accessorFixture } from "./helpers/accessor-fixture"
import { getElement } from "./helpers/get-element"

window.requestAnimationFrame = jest.fn().mockImplementation((fn) => fn())
window.cancelAnimationFrame = jest.fn().mockImplementation((fn) => fn())

describe("UpgradedElement", () => {
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

    describe("reflected", () => {
      it("reflects property to attribute", () => {
        // Given
        const properties = {
          reflectedProp: { reflected: true },
        }
        basicFixture("reflect-one", { properties })
        // Then
        const element = getElement("reflect-one", false)
        expect(element.hasAttribute("reflected-prop")).toBe(true)
        expect(element.getAttribute("reflected-prop")).toEqual("")
      })

      it("reflects property to attribute with value, if given", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        basicFixture("reflect-two", { properties })
        // Then
        const element = getElement("reflect-two", false)
        expect(element.hasAttribute("reflected-prop")).toBe(true)
        expect(element.getAttribute("reflected-prop")).toEqual("foo")
      })

      it("updates attribute if reflected property value is changed", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        basicFixture("reflect-three", { properties })
        const element = getElement("reflect-three", false)
        element.reflectedProp = "bar"
        // Then
        expect(element.getAttribute("reflected-prop")).toEqual("bar")
      })

      it("removes attribute if set as undefined", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        basicFixture("reflect-four", { properties })
        const element = getElement("reflect-four", false)
        element.reflectedProp = undefined
        // Then
        expect(element.reflectedProp).toBeUndefined()
        expect(element.hasAttribute("reflected-prop")).toBe(false)
      })
    })

    /* eslint-disable no-console */
    console.warn = jest.fn()

    describe("warnings", () => {
      const warningMessage = `[UpgradedElement]: Property 'testProp1' is invalid type of 'string'. Expected 'boolean'. Check TestElement.`

      it("will print warning on upgrade if assigned type doesn't match", () => {
        // Given
        const properties = {
          testProp1: {
            type: "boolean",
            default: "foo",
          },
        }
        basicFixture("upgrade-type-warn", { properties })
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
        basicFixture("change-type-warn", { properties })
        // When
        getElement("change-type-warn", false).testProp1 = "foo"
        // Then
        expect(console.warn).toBeCalledWith(warningMessage)
      })
    })

    console.warn.mockClear()
    /* eslint-enable no-console */
  })
})
