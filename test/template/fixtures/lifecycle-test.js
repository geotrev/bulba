import { KitchenSinkTest } from "./kitchen-sink-test"
import { register } from "../../../src/index.js"

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
    console.log("connectedCallback, before RotomElement callback")
    super.connectedCallback()
    console.log("connectedCallback, after RotomElement callback")
  }

  /**
   * Use `disconnectedCallback` directly to control if disconnect teardown occurs before or after DOM teardown.
   */

  disconnectedCallback() {
    console.log("disconnectedCallback, before RotomElement callback")
    super.disconnectedCallback()
    console.log("disconnectedCallback, after RotomElement callback")
  }

  /**
   * Use `attributeChangedCallback` directly to control additional callback logic.
   */

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback, before RotomElement callback")
    super.attributeChangedCallback(name, oldValue, newValue)
    console.log("attributeChangedCallback, after RotomElement callback")
  }

  /**
   * Triggers every time a generated property is changed. Managed property setters need
   * to call this method manually.
   */

  onPropertyChange(property, oldValue, newValue) {
    console.log("onPropertyChange", property, oldValue, newValue)
  }

  /**
   * Piggybacks on `attributeChangedCallback`. Only triggers if the previous value isn't
   * equal to the new value.
   */

  onAttributeChange(attribute, oldValue, newValue) {
    console.log("onAttributeChange", attribute, oldValue, newValue)
  }

  /**
   * Triggered as soon as the component is connected, but before styles or real DOM
   * have been patched.
   */

  onConnect() {
    console.log("onConnect")
  }

  /**
   * Triggered after every render, excluding initial mount
   */

  onUpdate() {
    console.log("onUpdate")
    console.log("====================")
  }

  /**
   * Triggered at the end of connectedCallback, when the DOM is attached
   * Attributes are available and handlers can be registered.
   */

  onMount() {
    super.onMount()
    console.log("onMount")
    this.count = this.count + 1
    console.log("====================")
  }

  /**
   * The DOM will be remvoed after this lifecycle.
   * Handlers can be deregistered and timers can be cleared.
   */

  onUnmount() {
    super.onUnmount()
    console.log("onUnmount")
  }

  /**
   * Returns a template representation of the shadow root's view. It must be a string.
   */

  render() {
    return super.render()
  }
}

register("lifecycle-test", LifecycleTest)
