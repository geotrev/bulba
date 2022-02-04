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
  { default: defaultValue, type: propType, reflected = false, safe = false },
  privateName
) => {
  let initialValue

  // Initialize the value
  //
  // 1. If the property happens to be pre-existing, set aside
  //    the old value to a separate prop and use its value on
  //    the replacement
  // 1. If the default is a function, compute the value
  // 2. Otherwise, just set the value as the default

  if (!isUndefined(Cls[propName])) {
    Cls[getTempName(propName)] = Cls[propName]
    initialValue = Cls[propName]
  } else if (isFunction(defaultValue)) {
    initialValue = defaultValue(Cls)
  } else {
    initialValue = defaultValue
  }

  // Validate the property's default value type, if given
  // Initialize the private property

  const valueEmpty = isUndefined(initialValue)
  const attrName = camelToKebab(propName)
  const attrValue = Cls.getAttribute(attrName)

  if (!valueEmpty) {
    if (BUILD_ENV === "development") {
      validateType(Cls, propName, initialValue, propType)
    }

    if (safe && isString(initialValue)) {
      initialValue = sanitizeString(initialValue)
    }

    Cls[privateName] = initialValue
  } else if (reflected && attrValue) {
    // if reflected, attribute value exists, and no default given,
    // set the attribute value to the private prop
    //
    // attributes can only have strings, so no need to type check

    initialValue = safe ? sanitizeString(attrValue) : attrValue
    Cls[privateName] = initialValue
  }

  if (reflected && !attrValue) {
    const initialAttrValue = initialValue ? String(initialValue) : ""
    Cls.setAttribute(attrName, initialAttrValue)
  }
}
