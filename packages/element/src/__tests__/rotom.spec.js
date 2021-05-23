import { createBasicFixture } from "./fixtures/basic-fixture"
import { createAccessorFixture } from "./fixtures/accessor-fixture"
import { createLifecycleFixture } from "./fixtures/lifecycle-fixture"
import { getElement } from "./fixtures/get-element"
import * as external from "../external"

window.requestAnimationFrame = jest.fn().mockImplementation((fn) => fn())

describe("Rotom", () => {
  afterEach(() => (document.innerHTML = ""))

  it("upgrades the element", () => {
    // Given
    createBasicFixture("rotom")
    // Then
    expect(getElement("rotom").hasAttribute("rotom-id")).toBe(true)
  })

  it("creates a shadow root", () => {
    // Given
    createBasicFixture("creates-shadow")
    // Then
    expect(getElement("creates-shadow").shadowRoot).not.toBeNull()
  })

  it("renders styles to shadow root", () => {
    // Given
    const styles = "div { display: block; }"
    createBasicFixture("styles", { styles })
    // Then
    expect(
      getElement("styles").shadowRoot.querySelector("style")
    ).not.toBeNull()
    expect(
      getElement("styles").shadowRoot.querySelector("style").textContent
    ).toEqual(styles)
  })

  it("assigns slots, if given", () => {
    // Given
    const slotName = "main"
    createBasicFixture("slotted", {
      slotName,
      content: `<slot name='main'></slot>`,
    })
    // Then
    expect(
      getElement("slotted").shadowRoot.querySelector("slot").assignedNodes()
    ).toHaveLength(1)
  })

  it("applies default document direction via dir attribute", () => {
    // Given
    createBasicFixture("direction")
    // Then
    expect(getElement("direction").getAttribute("dir")).toEqual("ltr")
  })

  describe("properties", () => {
    it("upgrades properties", () => {
      // Given
      const properties = {
        testProp1: { default: "foo" },
      }
      createBasicFixture("props", { properties })
      // Then
      expect(getElement("props").testProp1).toEqual(
        properties.testProp1.default
      )
    })

    it("re-renders view if value changes", () => {
      // Given
      const properties = {
        testProp1: { default: "foo" },
      }
      const nextValue = "bar"
      createBasicFixture("val-change", { properties })
      // When
      getElement("val-change").testProp1 = nextValue
      // Then
      expect(getElement("val-change").testProp1).toEqual(nextValue)
      expect(
        getElement("val-change").shadowRoot.querySelector("div").textContent
      ).toEqual(nextValue)
    })

    it("doesn't upgrade properties if accessors already exist", () => {
      // Given
      createAccessorFixture("no-upgrade")
      // Then
      expect(getElement("no-upgrade").count).toEqual(1)
    })

    describe("safe", () => {
      it("sanitizes string on upgrade", () => {
        // Given
        const properties = {
          safeString: {
            default: "<span>unsafe</span>",
            type: "string",
            safe: true,
          },
        }
        createBasicFixture("safe-upgrade", { properties })
        // Then
        const nextValue = "&lt;span&gt;unsafe&lt;/span&gt;"
        expect(getElement("safe-upgrade").safeString).toEqual(nextValue)
      })

      it("sanitizes new string value", () => {
        // Given
        const properties = {
          safeString: {
            default: "<span>unsafe</span>",
            type: "string",
            safe: true,
          },
        }
        createBasicFixture("safe-change", { properties })
        // When
        getElement("safe-change").safeString = "&hello"
        // Then
        const nextValue = "&amp;hello"
        expect(getElement("safe-change").safeString).toEqual(nextValue)
      })
    })

    describe("reflected", () => {
      it("reflects property to attribute", () => {
        // Given
        const properties = {
          reflectedProp: { reflected: true },
        }
        createBasicFixture("reflect-one", { properties })
        // Then
        const element = getElement("reflect-one")
        expect(element.hasAttribute("reflected-prop")).toBe(true)
        expect(element.getAttribute("reflected-prop")).toEqual("")
      })

      it("reflects property to attribute with value, if given", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        createBasicFixture("reflect-two", { properties })
        // Then
        const element = getElement("reflect-two")
        expect(element.hasAttribute("reflected-prop")).toBe(true)
        expect(element.getAttribute("reflected-prop")).toEqual("foo")
      })

      it("updates attribute if reflected property value is changed", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        createBasicFixture("reflect-three", { properties })
        const element = getElement("reflect-three")
        element.reflectedProp = "bar"
        // Then
        expect(element.getAttribute("reflected-prop")).toEqual("bar")
      })

      it("removes attribute if set as undefined", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        createBasicFixture("reflect-four", { properties })
        const element = getElement("reflect-four")
        element.reflectedProp = undefined
        // Then
        expect(element.reflectedProp).toBeUndefined()
        expect(element.hasAttribute("reflected-prop")).toBe(false)
      })
    })

    /* eslint-disable no-console */
    console.warn = jest.fn()

    describe("warnings", () => {
      const warningMessage = `[Rotom]: Property 'testProp1' is invalid type of 'string'. Expected 'boolean'. Check TestElement.`

      it("will print warning on upgrade if assigned type doesn't match", () => {
        // Given
        const properties = {
          testProp1: {
            type: "boolean",
            default: "foo",
          },
        }
        createBasicFixture("upgrade-type-warn", { properties })
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
        createBasicFixture("change-type-warn", { properties })
        // When
        getElement("change-type-warn").testProp1 = "foo"
        // Then
        expect(console.warn).toBeCalledWith(warningMessage)
      })
    })

    console.warn.mockClear()
    /* eslint-enable no-console */
  })

  describe("lifecycle methods", () => {
    it("calls elementPropertyChanged", () => {
      const Cls = createLifecycleFixture("prop-changed")
      Cls.prototype[external.elementPropertyChanged] = jest.fn()
      getElement("prop-changed").testProp = true
      expect(Cls.prototype[external.elementPropertyChanged]).toBeCalledWith(
        "testProp",
        false,
        true
      )
    })

    it("calls elementAttributeChanged", () => {
      const Cls = createLifecycleFixture("attr-changed")
      Cls.prototype[external.elementAttributeChanged] = jest.fn()
      getElement("attr-changed").testProp = true
      expect(Cls.prototype[external.elementAttributeChanged]).toBeCalledWith(
        "test-prop",
        "",
        "true"
      )
    })

    it("calls elementDidUpdate", () => {
      const Cls = createLifecycleFixture("update")
      Cls.prototype[external.elementDidUpdate] = jest.fn()
      getElement("update").testProp = true
      expect(Cls.prototype[external.elementDidUpdate]).toBeCalled()
    })

    it("calls elementDidUpdate if property updates in elementDidMount", async () => {
      const [init, Cls] = createLifecycleFixture("mount-update", true)
      Cls.prototype[external.elementDidMount] = () => {
        getElement("mount-update").testProp = true
      }
      Cls.prototype[external.elementDidUpdate] = jest.fn()
      init()
      expect(Cls.prototype[external.elementDidUpdate]).toBeCalled()
    })

    it("calls elementDidConnect", () => {
      const [init, Cls] = createLifecycleFixture("connect", true)
      Cls.prototype[external.elementDidConnect] = jest.fn()
      init()
      expect(Cls.prototype[external.elementDidConnect]).toBeCalled()
    })

    it("calls elementDidMount", () => {
      const [init, Cls] = createLifecycleFixture("mount", true)
      Cls.prototype[external.elementDidMount] = jest.fn()
      init()
      expect(Cls.prototype[external.elementDidMount]).toBeCalled()
    })

    it("calls elementWillUnmount", () => {
      const Cls = createLifecycleFixture("unmount")
      Cls.prototype[external.elementWillUnmount] = jest.fn()
      document.body.removeChild(getElement("unmount"))
      expect(Cls.prototype[external.elementWillUnmount]).toBeCalled()
    })

    it("recalls elementDidMount if the component is disconnected and then reconnected", async () => {
      const [init, Cls] = createLifecycleFixture("remount", true)
      Cls.prototype[external.elementDidMount] = jest.fn()
      init()
      const fixture = getElement("remount")
      document.body.removeChild(fixture)
      await new Promise((done) => setTimeout(done, 15))
      document.body.appendChild(fixture)
      expect(Cls.prototype[external.elementDidMount]).toBeCalledTimes(2)
    })
  })
})
