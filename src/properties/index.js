import * as internal from "../internal"
import * as external from "../external"
import { isUndefined, toKebabCase, sanitizeString } from "../utilities"
import { initializePropertyValue } from "./initialize-property-value"

/**
 * Upgrade a property based on its configuration. If accessors are detected in
 * the extender, skip the upgrade.
 * @param {Object} UpgradedInstance
 * @param {string} propName
 * @param {{value, default, reflected}} configuration
 */
export const upgradeProperty = (
  UpgradedInstance,
  propName,
  configuration = {}
) => {
  // If the constructor class is using its own setter/getter, bail
  if (
    Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(UpgradedInstance),
      propName
    )
  ) {
    return
  }

  const privateName = Symbol(propName)
  const { type, reflected = false, safe = false } = configuration

  initializePropertyValue(
    UpgradedInstance,
    propName,
    configuration,
    privateName
  )

  // Finally, declare its accessors

  Object.defineProperty(UpgradedInstance, propName, {
    configurable: true,
    enumerable: true,
    get() {
      return UpgradedInstance[privateName]
    },
    set(value) {
      // Don't set if the value is the same to prevent unnecessary re-renders.
      if (value === UpgradedInstance[privateName]) return
      if (type) UpgradedInstance[external.validateType](propName, value, type)

      const oldValue = UpgradedInstance[privateName]

      if (!isUndefined(value)) {
        UpgradedInstance[privateName] =
          safe && (type === "string" || typeof value === "string")
            ? sanitizeString(value)
            : value

        UpgradedInstance[internal.runLifecycle](
          external.elementPropertyChanged,
          propName,
          oldValue,
          value
        )

        if (reflected) {
          const attribute = toKebabCase(propName)
          const attrValue = String(value)
          UpgradedInstance.setAttribute(attribute, attrValue)
        }
      } else {
        delete UpgradedInstance[privateName]

        UpgradedInstance[internal.runLifecycle](
          external.elementPropertyChanged,
          propName,
          oldValue,
          value
        )

        if (reflected) {
          const attribute = toKebabCase(propName)
          UpgradedInstance.removeAttribute(attribute)
        }
      }

      UpgradedInstance[external.requestRender]()
    },
  })
}
