import { register } from "../../src"
import { ReflectPropertiesTest } from "./reflect-properties-test"

/* eslint-disable no-console */

class LifecycleTest extends ReflectPropertiesTest {
  /**
   * Two types of properties: `generated` and `managed`.
   * - A `generated` property is similar to that in LitElement. When you declare a property here, it
   *   is 'generated' with lifecycle-connected accessors internally.
   * - A 'managed' property is custom. If you 'handle` your property with a custom getter and/or setter
   *   at the component level, UpgradedElement skips accessor generation. As a result, the lifecycle, `default`, and `reflected`
   *   logic needs to be custom-specified as well.
   *   NOTE: Hook into renders with `this.requestRender()`.
   *
   * Properties that are generated have these options:
   * 1. `type`: Performs a simple `typeof` check on the value. If it there's a mismatch, a warning is logged
   * 2. `reflected`: to set a kebab-case version of the property as an attribute
   * 3. `default`: The default/initial value of the property.
   *               If it's a function, it's evaluated (useful for setting the value based on an attribute).
   *               The function receives one parameter, which is the the element itself.
   */

  // static get properties() {}

  /**
   * Styles are attached before any DOM has been rendered, but at the beginning of connected callback.
   * `styles` must return CSS represented as a string.
   */

  // static get styles() {}

  /**
   * Custom properties and other handlers can be bound here. The component is not in the DOM but is
   * bootstrapped with its id and shadow root.
   */

  constructor() {
    super()
  }

  /**
   * Use `connectedCallback` directly to control if connect setup occurs before or after DOM setup.
   */

  connectedCallback() {
    console.log("connectedCallback, before UpgradedElement callback")
    super.connectedCallback()
    console.log("connectedCallback, after UpgradedElement callback")
  }

  /**
   * Use `disconnectedCallback` directly to control if disconnect teardown occurs before or after DOM teardown.
   */

  disconnectedCallback() {
    console.log("disconnectedCallback, before UpgradedElement callback")
    super.disconnectedCallback()
    console.log("disconnectedCallback, after UpgradedElement callback")
  }

  /**
   * Use `attributeChangedCallback` directly to control additional callback logic.
   */

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback, before UpgradedElement callback")
    super.attributeChangedCallback(name, oldValue, newValue)
    console.log("attributeChangedCallback, after UpgradedElement callback")
  }

  /**
   * Triggers every time a generated property is changed. Managed property setters need
   * to call this method manually.
   */

  elementPropertyChanged(property, oldValue, newValue) {
    console.log("elementPropertyChanged", property, oldValue, newValue)
  }

  /**
   * Piggybacks on `attributeChangedCallback`. Only triggers if the previous value isn't
   * equal to the new value.
   */

  elementAttributeChanged(attribute, oldValue, newValue) {
    console.log("elementAttributeChanged", attribute, oldValue, newValue)
  }

  /**
   * Triggered as soon as the component is connected, but before styles or real DOM
   * have been patched.
   */

  elementDidConnect() {
    console.log("elementDidConnect")
  }

  /**
   * Triggered after every render, excluding initial mount
   */

  elementDidUpdate() {
    console.log("elementDidUpdate")
    console.log("====================")
  }

  /**
   * Triggered at the end of connectedCallback, when the DOM is attached
   * Attributes are available and handlers can be registered.
   */

  elementDidMount() {
    super.elementDidMount()
    console.log("elementDidMount")
    console.log("====================")
  }

  /**
   * The DOM will be remvoed after this lifecycle.
   * Handlers can be deregistered and timers can be cleared.
   */

  elementWillUnmount() {
    super.elementWillUnmount()
    console.log("elementWillUnmount")
  }

  /**
   * Returns a template representation of the shadow root's view. It must be a string.
   */

  render() {
    console.log("render")
    return super.render()
  }
}

register("lifecycle-test", LifecycleTest)
