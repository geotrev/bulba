import { createBasicFixture } from "./fixtures/basic-fixture"
import { createAccessorFixture } from "./fixtures/accessor-fixture"
import { createTempLifecycleFixture } from "./fixtures/template-lifecycle-fixture"
import { createJsxLifecycleFixture } from "./fixtures/jsx-lifecycle-fixture"
import { createPropTransformFixture } from "./fixtures/jsx-transform-prop-fixture"
import { getElement } from "./fixtures/get-element"
import { External } from "../enums"
import { jest } from "@jest/globals"

window.requestAnimationFrame = jest.fn().mockImplementation((fn) => fn())

describe("RotomElement", () => {
  afterEach(() => (document.body.innerHTML = ""))

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
      const warningMessage = `[RotomElement]: Property 'testProp1' is invalid type of 'string'. Expected 'boolean'. Check TestElement.`

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

  const lifecycleFixtures = [
    [createTempLifecycleFixture, "template"],
    [createJsxLifecycleFixture, "jsx"],
  ]

  lifecycleFixtures.forEach(([createFixture, rendererType]) => {
    describe(`${rendererType} renderer lifecycle methods`, () => {
      it("calls onPropertyChange", () => {
        const Cls = createFixture(`${rendererType}-prop-changed`)
        Cls.prototype[External.onPropertyChange] = jest.fn()
        getElement(`${rendererType}-prop-changed`).testProp = true
        expect(Cls.prototype[External.onPropertyChange]).toBeCalledWith(
          "testProp",
          false,
          true
        )
      })

      it("calls onAttributeChange", () => {
        const Cls = createFixture(`${rendererType}-attr-changed`)
        Cls.prototype[External.onAttributeChange] = jest.fn()
        getElement(`${rendererType}-attr-changed`).testProp = true
        expect(Cls.prototype[External.onAttributeChange]).toBeCalledWith(
          "test-prop",
          "",
          "true"
        )
      })

      it("calls onUpdate", () => {
        const Cls = createFixture(`${rendererType}-update`)
        Cls.prototype[External.onUpdate] = jest.fn()
        getElement(`${rendererType}-update`).testProp = true
        expect(Cls.prototype[External.onUpdate]).toBeCalled()
      })

      it("calls onUpdate if property updates in onMount", async () => {
        const [init, Cls] = createFixture(`${rendererType}-mount-update`, true)
        Cls.prototype[External.onMount] = () => {
          getElement(`${rendererType}-mount-update`).testProp = true
        }
        Cls.prototype[External.onUpdate] = jest.fn()
        init()
        expect(Cls.prototype[External.onUpdate]).toBeCalled()
      })

      it("calls onConnect", () => {
        const [init, Cls] = createFixture(`${rendererType}-connect`, true)
        Cls.prototype[External.onConnect] = jest.fn()
        init()
        expect(Cls.prototype[External.onConnect]).toBeCalled()
      })

      it("calls onMount", () => {
        const [init, Cls] = createFixture(`${rendererType}-mount`, true)
        Cls.prototype[External.onMount] = jest.fn()
        init()
        expect(Cls.prototype[External.onMount]).toBeCalled()
      })

      it("calls onUnmount", () => {
        const Cls = createFixture(`${rendererType}-unmount`)
        Cls.prototype[External.onUnmount] = jest.fn()
        document.body.removeChild(getElement(`${rendererType}-unmount`))
        expect(Cls.prototype[External.onUnmount]).toBeCalled()
      })

      it("recalls onMount if the component is disconnected and then reconnected", async () => {
        const [init, Cls] = createFixture(`${rendererType}-remount`, true)
        Cls.prototype[External.onMount] = jest.fn()
        init()
        const fixture = getElement(`${rendererType}-remount`)
        document.body.removeChild(fixture)
        await new Promise((done) => setTimeout(done, 15))
        document.body.appendChild(fixture)
        expect(Cls.prototype[External.onMount]).toBeCalledTimes(2)
      })
    })
  })

  describe("jsx prop transformers", () => {
    it("applies className prop to data.props.className", () => {
      // Given
      const tagName = "class-transform"
      const className = "foo"
      createPropTransformFixture(tagName, { className })
      const node = getElement(tagName).shadowRoot.firstElementChild
      // Then
      expect(node.getAttribute("class")).toEqual(className)
    })

    it("applies aria prop to data.attrs", () => {
      // Given
      const tagName = "aria-transform"
      const ariaLabel = "foo"
      createPropTransformFixture(tagName, { ariaLabel })
      const node = getElement(tagName).shadowRoot.firstElementChild
      // Then
      expect(node.getAttribute("aria-label")).toEqual(ariaLabel)
    })

    it("applies data prop to data.dataset", () => {
      // Given
      const tagName = "dataset-transform"
      const dataset = "foo"
      createPropTransformFixture(tagName, { dataset })
      const node = getElement(tagName).shadowRoot.firstElementChild
      // Then
      expect(node.getAttribute("data-baz-buz")).toEqual(dataset)
    })

    it("applies event handler data.on", () => {
      // Given
      let num = 0
      const handler = () => (num += 1)
      const assert = () => expect(num).toEqual(1)
      const tagName = "handler-transform"
      createPropTransformFixture(tagName, { handler })
      // Then
      document.body.addEventListener("click", assert)
      getElement(tagName).shadowRoot.firstElementChild.click()
      document.body.removeEventListener("click", assert)
    })

    it("applies hook prop to data.hook", () => {
      // Given
      let num = 0
      const hookDestroy = () => (num += 1)
      const tagName = "hook-transform"
      createPropTransformFixture(tagName, { hookDestroy })
      // When
      const fixture = getElement(tagName)
      fixture.parentNode.removeChild(fixture)
      // Then
      expect(num).toEqual(1)
    })
  })
})
