import { Internal, External } from "../enums"
import { isUndefined, toKebabCase, sanitizeString } from "../utilities"
import { initializePropertyValue } from "./initialize-property-value"

/**
 * Upgrade a property based on its configuration. If accessors are detected in
 * the extender, skip the upgrade.
 * @param {Object} RotomInstance
 * @param {string} propName
 * @param {{value, default, reflected}} configuration
 */
export const upgradeProperty = (
  RotomInstance,
  propName,
  configuration = {}
) => {
  // If the constructor class is using its own setter/getter, bail
  if (
    Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(RotomInstance),
      propName
    )
  ) {
    return
  }

  const privateName = Symbol(propName)
  const { type, reflected = false, safe = false } = configuration

  initializePropertyValue(RotomInstance, propName, configuration, privateName)

  // Finally, declare its accessors

  Object.defineProperty(RotomInstance, propName, {
    configurable: true,
    enumerable: true,
    get() {
      return RotomInstance[privateName]
    },
    set(value) {
      // Don't set if the value is the same to prevent unnecessary re-renders.
      if (value === RotomInstance[privateName]) return
      if (type) RotomInstance[External.validateType](propName, value, type)

      const oldValue = RotomInstance[privateName]

      if (!isUndefined(value)) {
        RotomInstance[privateName] =
          safe && (type === "string" || typeof value === "string")
            ? sanitizeString(value)
            : value

        RotomInstance[Internal.runLifecycle](
          External.onPropertyChange,
          propName,
          oldValue,
          value
        )

        if (reflected) {
          const attribute = toKebabCase(propName)
          const attrValue = String(value)
          RotomInstance.setAttribute(attribute, attrValue)
        }
      } else {
        delete RotomInstance[privateName]

        RotomInstance[Internal.runLifecycle](
          External.onPropertyChange,
          propName,
          oldValue,
          value
        )

        if (reflected) {
          const attribute = toKebabCase(propName)
          RotomInstance.removeAttribute(attribute)
        }
      }

      RotomInstance[External.requestRender]()
    },
  })
}
