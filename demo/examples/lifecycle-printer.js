import { register } from "../../src/upgraded-component"
import { CoolLabel } from "./cool-label"

class LifecyclePrinter extends CoolLabel {
  /**
   * Two types of properties: `generated` and `managed`.
   * - A `generated` property is similar to that in LitElement. When you declare a property here, it
   *   is 'generated' with lifecycle-connected accessors internally.
   * - A 'managed' property is custom. If you 'handle` your property with a custom getter and/or setter
   *   at the component level, UpgradedComponent skips accessor generation. As a result, the lifecycle, `default`, and `reflected`
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
    console.log("connectedCallback, before UpgradedComponent callback")
    super.connectedCallback()
    console.log("connectedCallback, after UpgradedComponent callback")
  }

  /**
   * Use `disconnectedCallback` directly to control if disconnect teardown occurs before or after DOM teardown.
   */

  disconnectedCallback() {
    console.log("disconnectedCallback, before UpgradedComponent callback")
    super.disconnectedCallback()
    console.log("disconnectedCallback, after UpgradedComponent callback")
  }

  /**
   * Use `attributeChangedCallback` directly to control additional callback logic.
   */

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback, before UpgradedComponent callback")
    super.attributeChangedCallback(name, oldValue, newValue)
    console.log("attributeChangedCallback, after UpgradedComponent callback")
  }

  /**
   * Triggers every time a generated property is changed. Managed property setters need
   * to call this method manually.
   */

  componentPropertyChanged(property, oldValue, newValue) {
    console.log("componentPropertyChanged", property, oldValue, newValue)
  }

  /**
   * Piggybacks on `attributeChangedCallback`. Only triggers if the previous value isn't
   * equal to the new value.
   */

  componentAttributeChanged(attribute, oldValue, newValue) {
    console.log("componentAttributeChanged", attribute, oldValue, newValue)
  }

  /**
   * Triggered as soon as the component is connected, but before styles or real DOM
   * have been patched.
   */

  componentDidConnect() {
    console.log("componentDidConnect")
  }

  /**
   * Triggered after every render, excluding initial mount
   */

  componentDidUpdate() {
    console.log("componentDidUpdate")
  }

  /**
   * Triggered at the end of connectedCallback, when the DOM is attached
   * Attributes are available and handlers can be registered.
   */

  componentDidMount() {
    super.componentDidMount()
    console.log("componentDidMount")
  }

  /**
   * The DOM will be remvoed after this lifecycle.
   * Handlers can be deregistered and timers can be cleared.
   */

  componentWillUnmount() {
    super.componentWillUnmount()
    console.log("componentWillUnmount")
  }

  /**
   * Returns a template representation of the shadow root's view. It must be a string.
   */

  render() {
    console.log("render")
    return super.render()
  }
}

register("lifecycle-printer", LifecyclePrinter)
