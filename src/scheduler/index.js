import { isFunction } from "../utilities/is-type"

/**
 * This scheduler uses either requestAnimationFrame or setTimeout
 * to schedule a function at approximately the next frame.
 *
 * These need to be async because the function may block other
 * operations before updating.
 */

export function getScheduler() {
  // Store these in case for some reason they are reassigned later during the page lifecycle.
  const requestAnimationFrame = window.requestAnimationFrame
  const setTimeout = window.setTimeout
  const FRAME_DURATION = 1000 / 60
  let scheduled = null

  /**
   * Executes a rAF or timeout (depending on which is available)
   * If a fn is already scheduled, nothing happens.
   */
  function schedule(fn) {
    if (scheduled) return

    if (isFunction(requestAnimationFrame)) {
      scheduled = requestAnimationFrame(() => {
        scheduled = null
        fn()
      })
    } else if (isFunction(setTimeout)) {
      scheduled = setTimeout(() => {
        scheduled = null
        fn()
      }, FRAME_DURATION)
    }
  }

  return (fn) => schedule(fn)
}
