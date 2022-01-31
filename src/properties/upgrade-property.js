import { Internal, External } from "../enums"
import {
  isUndefined,
  camelToKebab,
  sanitizeString,
  isString,
  getTempName,
} from "../utilities"
import { initializePropertyValue } from "./initialize-property-value"
import { validateType } from "./validate-type"

/**
 * Upgrade a property based on its configuration. If accessors are detected in
 * the extender, skip the upgrade.
 * @param {HTMLElement} Cls
 * @param {string} propName
 * @param {{ default, type, reflected, safe }} configuration
 */
export const upgradeProperty = (Cls, propName, configuration = {}) => {
  // If the constructor class is using its own setter/getter, bail
  if (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Cls), propName)) {
    return
  }

  const privateName = Symbol(propName)
  const { type, reflected = false, safe = false } = configuration

  if (reflected) {
    Cls[Internal.propMap][propName] = privateName
  }

  initializePropertyValue(Cls, propName, configuration, privateName)

  // define the upgraded prop accessors

  Object.defineProperty(Cls, propName, {
    configurable: true,
    enumerable: true,
    get() {
      return Cls[privateName]
    },
    set(value) {
      // Don't set if the value is the same to prevent unnecessary re-renders.
      if (value === Cls[privateName]) return

      if (BUILD_ENV === "development") {
        validateType(Cls, propName, value, type)
      }

      // If the reflected property was undefined previously, re-add the prop
      // to the propMap so attribute changes reflect to the property again
      if (reflected && !Cls[Internal.propMap[propName]]) {
        Cls[Internal.propMap][propName] = privateName
      }

      const oldValue = Cls[privateName]

      if (!isUndefined(value)) {
        Cls[privateName] =
          safe && type === "string" && isString(value) && value !== ""
            ? sanitizeString(value)
            : value

        Cls[Internal.runLifecycle](
          External.onPropertyChange,
          propName,
          oldValue,
          value
        )

        if (reflected) {
          const attribute = camelToKebab(propName)
          const attrValue = String(value)

          if (Cls.getAttribute(attribute) !== attrValue) {
            Cls.setAttribute(attribute, attrValue)
          }
        }
      } else {
        delete Cls[privateName]

        // Prevent attribute changes from updating the property unintentionally.
        if (reflected) {
          delete Cls[Internal.propMap][propName]
        }

        const initialValue = Cls[getTempName(propName)]
        if (!isUndefined(initialValue)) {
          Cls[propName] = initialValue
        }

        Cls[Internal.runLifecycle](
          External.onPropertyChange,
          propName,
          oldValue,
          value
        )

        if (reflected) {
          const attribute = camelToKebab(propName)
          Cls.removeAttribute(attribute)
        }
      }

      Cls[External.requestRender]()
    },
  })
}
