import { validateType } from "./validate-type"
import {
  isFunction,
  isUndefined,
  camelToKebab,
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

  let initialValue

  if (isFunction(defaultValue)) {
    initialValue = defaultValue(RotomInstance)
  } else if (typeof RotomInstance[propName] !== "undefined") {
    initialValue = RotomInstance[propName]

    // Set aside the initial value to a new property, before it's
    // deleted by the new accessors.
    RotomInstance[`__${propName}_initial`] = initialValue
  } else {
    initialValue = defaultValue
  }

  // Validate the property's default value type, if given
  // Initialize the private property

  if (!isUndefined(initialValue)) {
    if (BUILD_ENV === "development") {
      validateType(RotomInstance, propName, initialValue, propType)
    }

    if (safe && typeof initialValue === "string") {
      initialValue = sanitizeString(initialValue)
    }

    RotomInstance[privateName] = initialValue
  }

  // If the value is reflected, set its attribute.

  if (reflected) {
    const initialAttrValue = initialValue ? String(initialValue) : ""
    const attribute = camelToKebab(propName)
    RotomInstance.setAttribute(attribute, initialAttrValue)
  }
}
