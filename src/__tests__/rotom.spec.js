import { jsx } from "snabbdom"
import { mount } from "./helpers/mount"
import { External } from "../enums"
import { jest } from "@jest/globals"

window.requestAnimationFrame = jest.fn().mockImplementation((fn) => fn())

describe("RotomElement", () => {
  afterEach(() => (document.body.innerHTML = ""))

  it("upgrades the element", () => {
    // Given
    const fixture = mount({ view: "<div></div>" })
    // Then
    expect(fixture.hasAttribute("rotom-id")).toBe(true)
    expect(fixture.rotomId).toEqual(fixture.getAttribute("rotom-id"))
  })

  it("creates a shadow root", () => {
    // Given
    const fixture = mount({ view: "<div></div>" })
    // Then
    expect(fixture.shadowRoot).not.toBeNull()
  })

  it("renders styles to shadow root", () => {
    // Given
    const styles = ""
    const fixture = mount({ view: "<div></div>", styles })
    // Then
    expect(fixture.shadowRoot.querySelector("style").textContent).toEqual(
      styles
    )
  })

  it("applies default document direction via dir attribute", () => {
    // Given
    const fixture = mount({ view: "<div></div>" })
    // Then
    expect(fixture.getAttribute("dir")).toEqual("ltr")
  })

  describe("renderers", () => {
    it("renders a template view", () => {
      // Given
      const fixture = mount({ view: "<div></div>" })
      // Then
      expect(fixture.shadowRoot.querySelector("div")).not.toBeNull()
    })

    it("renders a jsx view", () => {
      // Given
      const fixture = mount({ view: <div /> })
      // Then
      expect(fixture.shadowRoot.querySelector("div")).not.toBeNull()
    })
  })

  describe("properties", () => {
    it("upgrades properties", () => {
      // Given
      const properties = {
        testProp: {},
      }
      const fixture = mount({
        view: "<div></div>",
        properties,
      })
      // Then
      expect(fixture.testProp).toEqual(undefined)
    })

    it("updates property value and rerenders view", () => {
      // Given
      const properties = { testProp: {} }
      const fixture = mount({ view: "<div></div>", properties })
      // When
      fixture.testProp = "bar"
      // Then
      expect(fixture.testProp).toEqual("bar")
      expect(fixture.count).toEqual(2)
    })

    it("doesn't upgrade properties if accessors already exist", () => {
      // Given
      const properties = { count: { default: 9999 } }
      const fixture = mount({
        view: "<div></div>",
        properties,
      })
      // Then
      expect(fixture.count).toEqual(1)
    })

    it("uses pre-existing property values over default", () => {
      // Given
      const properties = { testProp: { default: false } }
      const [TestElement, render] = mount({
        wait: true,
        view: "<div></div>",
        properties,
      })
      TestElement.prototype.testProp = true
      // When
      const fixture = render()
      // Then
      expect(fixture.testProp).toEqual(true)
    })

    it("uses attribute default value, if given", () => {
      // Given
      const properties = { testDefault: { reflected: true } }
      const attributes = { "test-default": "foo" }
      const fixture = mount({
        view: "<div></div>",
        properties,
        attributes,
      })
      // Then
      expect(fixture.testDefault).toEqual("foo")
    })

    describe("option.safe", () => {
      it("sanitizes string on upgrade", () => {
        // Given
        const properties = {
          stringProp: {
            default: "<span>unsafe</span>",
            type: "string",
            safe: true,
          },
        }
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
        // Then
        const nextValue = "&lt;span&gt;unsafe&lt;/span&gt;"
        expect(fixture.stringProp).toEqual(nextValue)
      })

      it("sanitizes new string value", () => {
        // Given
        const properties = {
          stringProp: {
            default: "<span>unsafe</span>",
            type: "string",
            safe: true,
          },
        }
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
        // When
        fixture.stringProp = "&hello"
        // Then
        const nextValue = "&amp;hello"
        expect(fixture.stringProp).toEqual(nextValue)
      })
    })

    describe("option.reflected", () => {
      it("reflects property to attribute", () => {
        // Given
        const properties = {
          reflectedProp: { reflected: true },
        }
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
        // Then
        expect(fixture.hasAttribute("reflected-prop")).toBe(true)
        expect(fixture.getAttribute("reflected-prop")).toEqual("")
      })

      it("reflects property to attribute with default value, if given", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
        // Then
        expect(fixture.getAttribute("reflected-prop")).toEqual("foo")
      })

      it("uses attribute value for default", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        const attributes = {
          "reflected-prop": "bar",
        }

        const fixture = mount({
          view: "<div></div>",
          properties,
          attributes,
        })
        // Then
        expect(fixture.reflectedProp).toEqual("bar")
      })

      it("updates attribute if reflected property value changed", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
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
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
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
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
        // When
        fixture.reflectedProp = undefined
        // Then
        expect(fixture.hasAttribute("reflected-prop")).toBe(false)
      })

      it("uses attribute value for undefined property default", () => {
        // Given
        const properties = {
          reflectedProp: { reflected: true },
        }
        const attributes = {
          "reflected-prop": "foo",
        }
        const fixture = mount({
          view: "<div></div>",
          properties,
          attributes,
        })
        // Then
        expect(fixture.reflectedProp).toEqual("foo")
      })

      it("does not set attribute value to undefined reflected property", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
        fixture.reflectedProp = undefined
        // When
        fixture.setAttribute("reflected-prop", "bar")
        // Then
        expect(fixture.reflectedProp).toBeUndefined()
      })

      it("sets attribute value to property when value is no longer undefined", () => {
        // Given
        const properties = {
          reflectedProp: { default: "foo", reflected: true },
        }
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
        fixture.reflectedProp = undefined
        // When
        fixture.reflectedProp = "baz"
        fixture.setAttribute("reflected-prop", "beep")
        // Then
        expect(fixture.reflectedProp).toEqual("beep")
      })
    })

    describe("property warnings", () => {
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
        mount({
          view: "<div></div>",
          properties,
        })
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
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
        // When
        fixture.testProp = "foo"
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
        mount({
          view: "<div></div>",
          properties,
        })
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
        mount({
          view: "<div></div>",
          properties,
        })
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
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
        fixture.testProp = undefined
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
        const fixture = mount({
          view: "<div></div>",
          properties,
        })
        fixture.testProp = undefined
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
        const attributes = {
          "test-reflect-required": "foo",
        }
        mount({
          view: "<div></div>",
          properties,
          attributes,
        })
        // Then
        expect(console.error).not.toBeCalledWith(requiredWarning)
      })
    })

    /* eslint-ehnable no-console */
  })

  const lifecycleFixtures = [
    ["<div></div>", "template"],
    [<div />, "jsx"],
  ]

  lifecycleFixtures.forEach(([view, rendererType]) => {
    describe(`${rendererType} lifecycle`, () => {
      it("calls onConnect", () => {
        // Given
        const [TestElement, render] = mount({ wait: true, view })
        TestElement.prototype[External.onConnect] = jest.fn()
        // When
        render()
        // Then
        expect(TestElement.prototype[External.onConnect]).toBeCalled()
      })

      it("calls onMount", () => {
        // Given
        const [TestElement, render] = mount({ wait: true, view })
        TestElement.prototype[External.onMount] = jest.fn()
        // When
        render()
        // Then
        expect(TestElement.prototype[External.onMount]).toBeCalled()
      })

      it("calls onPropertyChange", () => {
        // Given
        const properties = { testProp: {} }
        const [TestElement, render] = mount({
          wait: true,
          properties,
          view,
        })
        TestElement.prototype[External.onPropertyChange] = jest.fn()
        const fixture = render()
        // When
        fixture.testProp = true
        // Then
        expect(TestElement.prototype[External.onPropertyChange]).toBeCalledWith(
          "testProp",
          undefined,
          true
        )
      })

      it("calls onAttributeChange", () => {
        // Given
        const properties = { testProp: { reflected: true } }
        const [TestElement, render] = mount({
          wait: true,
          properties,
          view,
        })
        TestElement.prototype[External.onAttributeChange] = jest.fn()
        const fixture = render()
        // When
        fixture.testProp = true
        // Then
        expect(
          TestElement.prototype[External.onAttributeChange]
        ).toBeCalledWith("test-prop", "", "true")
      })

      it("calls onUpdate", () => {
        // Given
        const properties = { testProp: {} }
        const [TestElement, render] = mount({
          wait: true,
          properties,
          view,
        })
        TestElement.prototype[External.onUpdate] = jest.fn()
        const fixture = render()
        // When
        fixture.testProp = true
        // Then
        expect(TestElement.prototype[External.onUpdate]).toBeCalled()
      })

      it("calls onUpdate if property updates in onMount", async () => {
        // Given

        const properties = { testProp: {} }
        const [TestElement, render] = mount({
          wait: true,
          properties,
          view,
        })
        TestElement.prototype[External.onMount] = function () {
          // MOUNT NOTE: `mount` fixture is always first in the body.
          document.body.firstElementChild.testProp = true
        }
        TestElement.prototype[External.onUpdate] = jest.fn()
        // When
        render()
        // Then
        expect(TestElement.prototype[External.onUpdate]).toBeCalled()
      })

      it("calls onUnmount", () => {
        // Given
        const [TestElement, render] = mount({ wait: true, view })
        TestElement.prototype[External.onUnmount] = jest.fn()
        const fixture = render()
        // When
        document.body.removeChild(fixture)
        // Then
        expect(TestElement.prototype[External.onUnmount]).toBeCalled()
      })

      it("recalls onMount if the component is disconnected and then reconnected", () => {
        // Given
        const [TestElement, render] = mount({ wait: true, view })
        TestElement.prototype[External.onMount] = jest.fn()
        const fixture = render()
        // When
        document.body.removeChild(fixture)
        document.body.appendChild(fixture)
        // Then
        expect(TestElement.prototype[External.onMount]).toBeCalledTimes(2)
      })
    })
  })
})
