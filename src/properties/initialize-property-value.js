import { validateType } from "../external"
import {
  isFunction,
  isUndefined,
  toKebabCase,
  sanitizeString,
} from "../utilities"

export const initializePropertyValue = (
  UpgradedInstance,
  propName,
  configuration,
  privateName
) => {
  const {
    default: defaultValue,
    type,
    reflected = false,
    safe = false,
  } = configuration

  let initializedValue = isFunction(defaultValue)
    ? defaultValue(UpgradedInstance)
    : defaultValue

  // Validate the property's default value type, if given
  // Initialize the private property

  if (!isUndefined(initializedValue)) {
    if (type) {
      UpgradedInstance[validateType](propName, initializedValue, type)
    }

    if (safe && (type === "string" || typeof initializedValue === "string")) {
      initializedValue = sanitizeString(initializedValue)
    }

    UpgradedInstance[privateName] = initializedValue
  }

  // If the value is reflected, set its attribute.

  if (reflected) {
    const initialAttrValue = initializedValue ? String(initializedValue) : ""
    const attribute = toKebabCase(propName)
    UpgradedInstance.setAttribute(attribute, initialAttrValue)
  }
}
