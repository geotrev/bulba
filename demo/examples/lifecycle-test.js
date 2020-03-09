import { CoolLabel } from "./cool-label"

class LifecycleTest extends CoolLabel {
  constructor() {
    super()
  }

  compoenntPropertyChanged(property, oldValue, newValue) {
    // Called when a property value changes
    console.log("Property changed:", property, oldValue, newValue)
  }

  componentAttributeChanged(attribute, oldValue, newValue) {
    // Called when an attribute changes
    console.log("Attribute changed:", attribute, oldValue, newValue)
  }

  componentDidUpdate() {
    // Called on every render excluding initial mount
    console.log("Updated")
  }

  componentDidMount() {
    super.componentDidMount()
    // Called on first render
    console.log("Mounted")
  }

  componentWillUnmount() {
    super.componentWillUnmount()
    // Called just before disconnectedCallback flushes internal DOM and map refs
    console.log("Unmounting")
  }
}

if (!customElements.get("lifecycle-test")) customElements.define("lifecycle-test", LifecycleTest)
