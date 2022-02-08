import {
  isFunction,
  isUndefined,
  isString,
  camelToKebab,
  sanitizeString,
} from "@rotom/utils"
import { validateType } from "./validate-type"
import { validateRequired } from "./validate-required"

export function setDefaultvalue(
  Cls,
  propName,
  {
    default: defaultValue,
    type: propType,
    reflected = false,
    safe = false,
    required = false,
  },
  privateName
) {
  const attrName = camelToKebab(propName)
  const attrValue = Cls.getAttribute(attrName)

  // Initialize the value
  //
  // 1. If the value is reflected and the attribute has a value,
  //    use the value
  // 2. If the default is a function, compute it
  // 3. Otherwise, just use the default, even if undefined

  const initialValue =
    reflected && attrValue
      ? attrValue
      : !isUndefined(Cls[propName])
      ? Cls[propName]
      : isFunction(defaultValue)
      ? defaultValue(Cls)
      : defaultValue

  // Validate the property's default value type, if given

  if (BUILD_ENV === "development") {
    validateType(propName, initialValue, propType)
    validateRequired(propName, initialValue, propType, required)
  }

  // Set the private property

  if (!isUndefined(initialValue)) {
    const privateValue =
      safe && isString(initialValue)
        ? sanitizeString(initialValue)
        : initialValue

    Cls[privateName] = privateValue
  }

  // If no attribute and is reflected, set attribute

  if (reflected && !attrValue) {
    const initialAttrValue = initialValue ? String(initialValue) : ""
    Cls.setAttribute(attrName, initialAttrValue)
  }
}
