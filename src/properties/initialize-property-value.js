import { typeIsValid } from "./type-is-valid"
import {
  isFunction,
  isUndefined,
  toKebabCase,
  sanitizeString,
} from "../utilities"

export const initializePropertyValue = (
  RotomInstance,
  propName,
  configuration,
  privateName
) => {
  const {
    default: defaultValue,
    type: propType,
    reflected = false,
    safe = false,
  } = configuration

  // Initializing the property value:
  //
  // 1. If the default is a function, call it with the instance itself
  //    as the only argument
  // 2. If the prop name happens to be an existing property, set aside
  //    the property's value to a separate prop and use its value on
  //    the replacement
  // 3. Otherwise, just set the value as the default

  let initializedValue

  if (isFunction(defaultValue)) {
    initializedValue = defaultValue(RotomInstance)
  } else if (typeof RotomInstance[propName] !== "undefined") {
    initializedValue = RotomInstance[propName]

    // Set aside the initial value to a new property, before it's
    // deleted by the new accessors.
    RotomInstance[`__${propName}_initial`] = initializedValue
  } else {
    initializedValue = defaultValue
  }

  // Validate the property's default value type, if given
  // Initialize the private property

  if (!isUndefined(initializedValue)) {
    if (propType) {
      typeIsValid(RotomInstance, propName, initializedValue, propType)
    }

    if (safe && typeof initializedValue === "string") {
      initializedValue = sanitizeString(initializedValue)
    }

    RotomInstance[privateName] = initializedValue
  }

  // If the value is reflected, set its attribute.

  if (reflected) {
    const initialAttrValue = initializedValue ? String(initializedValue) : ""
    const attribute = toKebabCase(propName)
    RotomInstance.setAttribute(attribute, initialAttrValue)
  }
}
