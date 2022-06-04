import { isFunction } from "@bulba/utils"

/**
 * Optional methods to bind all functions in the class/object to itself.
 * https://www.smashingmagazine.com/2022/04/cta-modal-build-web-component/#binding-this-context
 */
export function bindMethods(Cls) {
  // Get properties from prototype
  const names = Object.getOwnPropertyNames(Object.getPrototypeOf(Cls))

  // If any properties are functions, bind them
  for (const name of names) {
    if (isFunction(Cls[name])) {
      Cls[name] = Cls[name].bind(Cls)
    }
  }
}
