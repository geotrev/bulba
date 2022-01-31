import { validateType } from "./validate-type"
import {
  isFunction,
  isUndefined,
  isString,
  camelToKebab,
  sanitizeString,
  getTempName,
} from "../utilities"

export const initializePropertyValue = (
  Cls,
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
  // 1. If the default is a function, compute the value
  // 2. If the prop name happens to be an existing property, set aside
  //    the property's value to a separate prop and use its value on
  //    the replacement
  // 3. Otherwise, just set the value as the default

  let initialValue

  if (isFunction(defaultValue)) {
    initialValue = defaultValue(Cls)
  } else if (!isUndefined(Cls[propName])) {
    initialValue = Cls[propName]

    // Set aside the initial value to a new property, before it's
    // deleted by the new accessors.
    Cls[getTempName(propName)] = initialValue
  } else {
    initialValue = defaultValue
  }

  // Validate the property's default value type, if given
  // Initialize the private property

  if (!isUndefined(initialValue)) {
    if (BUILD_ENV === "development") {
      validateType(Cls, propName, initialValue, propType)
    }

    if (safe && isString(initialValue)) {
      initialValue = sanitizeString(initialValue)
    }

    Cls[privateName] = initialValue
  }

  // If the value is reflected, set its attribute.

  if (reflected) {
    const initialAttrValue = initialValue ? String(initialValue) : ""
    const attribute = camelToKebab(propName)
    Cls.setAttribute(attribute, initialAttrValue)
  }
}
