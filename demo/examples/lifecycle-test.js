import { KitchenSinkTest } from "./kitchen-sink-test.js"
import { register } from "../../src/index.js"
// const register = window.UpgradedElement.register

/* eslint-disable no-console */

class LifecycleTest extends KitchenSinkTest {
  static get properties() {
    return {
      ...KitchenSinkTest.properties,
      count: {
        default: 0,
        type: "number",
      },
    }
  }

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
    this.count = this.count + 1
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
    return super.render()
  }
}

register("lifecycle-test", LifecycleTest)
