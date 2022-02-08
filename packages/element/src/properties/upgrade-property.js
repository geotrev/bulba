import {
  isUndefined,
  camelToKebab,
  sanitizeString,
  isString,
  Internal,
  External,
} from "@rotom/utils"
import { setDefaultvalue } from "./set-default-value"
import { validateRequired } from "./validate-required"
import { validateType } from "./validate-type"

/**
 * Upgrade a property based on its configuration. If accessors are detected in
 * the extender, skip the upgrade.
 * @param {HTMLElement} Cls
 * @param {string} propName
 * @param {{ default, type, reflected, safe }} configuration
 */
export function upgradeProperty(Cls, propName, configuration = {}) {
  // If the constructor class is using its own setter/getter, bail
  if (Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Cls), propName)) {
    return
  }

  const privateName = Symbol(propName)
  const {
    type,
    reflected = false,
    safe = false,
    required = false,
  } = configuration

  // If reflected, store the private name
  if (reflected) {
    Cls[Internal.reflectMap][propName] = privateName
  }

  setDefaultvalue(Cls, propName, configuration, privateName)

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
        validateType(propName, value, type)
        validateRequired(propName, value, type, required)
      }

      // If the reflected property was undefined previously, re-add the prop
      // to the reflectMap so attribute changes reflect to the property again
      if (reflected && !Cls[Internal.reflectMap][propName]) {
        Cls[Internal.reflectMap][propName] = privateName
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

        Cls[Internal.runLifecycle](
          External.onPropertyChange,
          propName,
          oldValue,
          value
        )

        // Prevent attribute changes from updating the property unintentionally.
        if (reflected) {
          delete Cls[Internal.reflectMap][propName]

          const attribute = camelToKebab(propName)
          Cls.removeAttribute(attribute)
        }
      }

      Cls[External.requestRender]()
    },
  })
}
