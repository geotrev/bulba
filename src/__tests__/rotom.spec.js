import { createBasicFixture } from "./fixtures/basic-fixture"
import { createAccessorFixture } from "./fixtures/accessor-fixture"
import { createTempLifecycleFixture } from "./fixtures/template-lifecycle-fixture"
import { createJsxLifecycleFixture } from "./fixtures/jsx-lifecycle-fixture"
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
    const fixture = getElement("styles")
    // Then
    expect(fixture.shadowRoot.querySelector("style")).not.toBeNull()
    expect(fixture.shadowRoot.querySelector("style").textContent).toEqual(
      styles
    )
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
      const fixture = getElement("val-change")
      // When
      fixture.testProp1 = nextValue
      // Then
      expect(fixture.testProp1).toEqual(nextValue)
      expect(fixture.shadowRoot.querySelector("div").textContent).toEqual(
        nextValue
      )
    })

    it("doesn't upgrade properties if accessors already exist", () => {
      // Given
      createAccessorFixture("no-upgrade")
      // Then
      expect(getElement("no-upgrade").count).toEqual(1)
    })

    it("uses pre-existing property values if they exist", () => {
      // Given
      const [mount, Cls] = createTempLifecycleFixture(
        "default-prop-value",
        true
      )
      Cls.prototype.testProp = true
      // When
      mount()
      const fixture = getElement("default-prop-value")
      // Then
      expect(fixture.testProp).toBe(true)
    })

    it("uses attribute default value, if given", () => {
      // Given
      const properties = {
        testAttrDefault: { reflected: true },
      }
      createBasicFixture("attr-default", {
        properties,
        attribute: "test-attr-default='foo'",
      })
      const fixture = getElement("attr-default")
      // Then
      expect(fixture.testAttrDefault).toEqual("foo")
    })

    describe("safe", () => {
      it("sanitizes string on upgrade", () => {
        // Given
        const nextValue = "&lt;span&gt;unsafe&lt;/span&gt;"
        const properties = {
          safeString: {
            default: "<span>unsafe</span>",
            type: "string",
            safe: true,
          },
        }
        createBasicFixture("safe-upgrade", { properties })
        // Then
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
        createBasicFixture("reflect-prop", { properties })
        // Then
        const fixture = getElement("reflect-prop")
        expect(fixture.hasAttribute("reflected-prop")).toBe(true)
        expect(fixture.getAttribute("reflected-prop")).toEqual("")
      })

      it("reflects property to attribute with value, if given", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        createBasicFixture("reflect-value", { properties })
        // Then
        const fixture = getElement("reflect-value")
        expect(fixture.hasAttribute("reflected-prop")).toBe(true)
        expect(fixture.getAttribute("reflected-prop")).toEqual("foo")
      })

      it("updates attribute if reflected property value is changed", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        createBasicFixture("reflect-update-attr", { properties })
        const fixture = getElement("reflect-update-attr")
        // When
        fixture.reflectedProp = "bar"
        // Then
        expect(fixture.getAttribute("reflected-prop")).toEqual("bar")
      })

      it("updates property if corresponding attribute is changed", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        createBasicFixture("reflect-update-prop", { properties })
        const fixture = getElement("reflect-update-prop")
        // When
        fixture.setAttribute("reflected-prop", "bar")
        // Then
        expect(fixture.reflectedProp).toEqual("bar")
      })

      it("removes attribute if set as undefined", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        createBasicFixture("reflect-remove-attr", { properties })
        const fixture = getElement("reflect-remove-attr")
        // When
        fixture.reflectedProp = undefined
        // Then
        expect(fixture.reflectedProp).toBeUndefined()
        expect(fixture.hasAttribute("reflected-prop")).toBe(false)
      })

      it("uses attribute value for undefined property default", () => {
        const properties = {
          reflectedProp: { reflected: true },
        }
        createBasicFixture("reflect-no-prop-default", {
          properties,
          attribute: "reflected-prop='foo'",
        })
        const fixture = getElement("reflect-no-prop-default")
        expect(fixture.reflectedProp).toEqual("foo")
      })

      describe("property set to undefined", () => {
        let fixture

        beforeEach(() => {
          // Given
          const properties = {
            reflectedProp: { default: "foo", reflected: true },
          }
          createBasicFixture("reflect-update-prop", { properties })
          fixture = getElement("reflect-update-prop")
          fixture.reflectedProp = undefined
        })

        it("won't set attribute value to property", () => {
          // When
          fixture.setAttribute("reflected-prop", "bar")
          // Then
          expect(fixture.reflectedProp).toBeUndefined()
        })

        it("sets attribute value to property if value is no longer undefined", () => {
          // When
          fixture.reflectedProp = "foo"
          fixture.setAttribute("reflected-prop", "bar")
          // Then
          expect(fixture.reflectedProp).toEqual("bar")
        })
      })
    })

    describe("warnings", () => {
      /* eslint-disable no-console */

      beforeAll(() => {
        console.warn = jest.fn()
        console.error = jest.fn()
      })

      afterAll(() => {
        console.warn.mockClear()
        console.error.mockClear()
      })

      const typeWarning =
        "[RotomElement]: Property 'testProp' is type 'string', expected 'boolean'."
      const requiredWithTypeWarning =
        "[RotomElement]: Property 'testProp' of type 'string' is required."
      const requiredWarning = "[RotomElement]: Property 'testProp' is required."

      it("will print warning on upgrade if assigned type doesn't match", () => {
        // Given
        const properties = {
          testProp: {
            type: "boolean",
            default: "foo",
          },
        }
        createBasicFixture("upgrade-type-warn", { properties })
        // Then
        expect(console.warn).toBeCalledWith(typeWarning)
      })

      it("will print warning on value change if assigned type doesn't match", () => {
        // Given
        const properties = {
          testProp: {
            type: "boolean",
            default: true,
          },
        }
        createBasicFixture("change-type-warn", { properties })
        // When
        getElement("change-type-warn").testProp = "foo"
        // Then
        expect(console.warn).toBeCalledWith(typeWarning)
      })

      it("will print error on upgrade if required prop has no default", () => {
        // Given
        const properties = {
          testProp: {
            required: true,
          },
        }
        createBasicFixture("upgrade-required-error", { properties })
        // Then
        expect(console.error).toBeCalledWith(requiredWarning)
      })

      it("will print error on upgrade if required, typed prop has no default", () => {
        // Given
        const properties = {
          testProp: {
            type: "string",
            required: true,
          },
        }
        createBasicFixture("upgrade-require-type-error", { properties })
        // Then
        expect(console.error).toBeCalledWith(requiredWithTypeWarning)
      })

      it("will print error on value change if required prop is undefined", () => {
        // Given
        const properties = {
          testProp: {
            required: true,
            default: "foo",
          },
        }
        createBasicFixture("change-required-error", { properties })
        getElement("change-required-error").testProp = undefined
        // Then
        expect(console.error).toBeCalledWith(requiredWarning)
      })

      it("will print error on value change if required, typed prop is undefined", () => {
        // Given
        const properties = {
          testProp: {
            required: true,
            type: "string",
            default: "foo",
          },
        }
        createBasicFixture("change-require-type-error", { properties })
        getElement("change-require-type-error").testProp = undefined
        // Then
        expect(console.error).toBeCalledWith(requiredWithTypeWarning)
      })

      it("will not print error on upgrade if required, reflected prop has attribute", () => {
        // Given
        const properties = {
          testReflectRequired: {
            required: true,
            reflected: true,
          },
        }
        createBasicFixture("upgrade-required-reflected-no-error", {
          properties,
          attribute: "test-reflect-required='foo'",
        })
        // Then
        expect(console.error).not.toBeCalledWith(requiredWarning)
      })
    })

    /* eslint-ehnable no-console */
  })

  const lifecycleFixtures = [
    [createTempLifecycleFixture, "template"],
    [createJsxLifecycleFixture, "jsx"],
  ]

  lifecycleFixtures.forEach(([createFixture, rendererType]) => {
    describe(`${rendererType} renderer lifecycle methods`, () => {
      it("calls onPropertyChange", () => {
        // Given
        const Cls = createFixture(`${rendererType}-prop-changed`)
        Cls.prototype[External.onPropertyChange] = jest.fn()
        // When
        getElement(`${rendererType}-prop-changed`).testProp = true
        // Then
        expect(Cls.prototype[External.onPropertyChange]).toBeCalledWith(
          "testProp",
          false,
          true
        )
      })

      it("calls onAttributeChange", () => {
        // Given
        const Cls = createFixture(`${rendererType}-attr-changed`)
        Cls.prototype[External.onAttributeChange] = jest.fn()
        // When
        getElement(`${rendererType}-attr-changed`).testProp = true
        // Then
        expect(Cls.prototype[External.onAttributeChange]).toBeCalledWith(
          "test-prop",
          "",
          "true"
        )
      })

      it("calls onUpdate", () => {
        // Given
        const Cls = createFixture(`${rendererType}-update`)
        Cls.prototype[External.onUpdate] = jest.fn()
        // When
        getElement(`${rendererType}-update`).testProp = true
        // Then
        expect(Cls.prototype[External.onUpdate]).toBeCalled()
      })

      it("calls onUpdate if property updates in onMount", async () => {
        // Given
        const [mount, Cls] = createFixture(`${rendererType}-mount-update`, true)
        Cls.prototype[External.onMount] = () => {
          getElement(`${rendererType}-mount-update`).testProp = true
        }
        Cls.prototype[External.onUpdate] = jest.fn()
        // When
        mount()
        // Then
        expect(Cls.prototype[External.onUpdate]).toBeCalled()
      })

      it("calls onConnect", () => {
        // Given
        const [mount, Cls] = createFixture(`${rendererType}-connect`, true)
        Cls.prototype[External.onConnect] = jest.fn()
        // When
        mount()
        // Then
        expect(Cls.prototype[External.onConnect]).toBeCalled()
      })

      it("calls onMount", () => {
        // Given
        const [mount, Cls] = createFixture(`${rendererType}-mount`, true)
        Cls.prototype[External.onMount] = jest.fn()
        // When
        mount()
        // Then
        expect(Cls.prototype[External.onMount]).toBeCalled()
      })

      it("calls onUnmount", () => {
        // Given
        const Cls = createFixture(`${rendererType}-unmount`)
        Cls.prototype[External.onUnmount] = jest.fn()
        // When
        document.body.removeChild(getElement(`${rendererType}-unmount`))
        // Then
        expect(Cls.prototype[External.onUnmount]).toBeCalled()
      })

      it("recalls onMount if the component is disconnected and then reconnected", async () => {
        // Given
        const [mount, Cls] = createFixture(`${rendererType}-remount`, true)
        Cls.prototype[External.onMount] = jest.fn()
        mount()
        const fixture = getElement(`${rendererType}-remount`)
        // When
        document.body.removeChild(fixture)
        await new Promise((done) => setTimeout(done, 15))
        document.body.appendChild(fixture)
        // Then
        expect(Cls.prototype[External.onMount]).toBeCalledTimes(2)
      })
    })
  })
})
