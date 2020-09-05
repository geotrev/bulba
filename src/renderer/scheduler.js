import { isFunction } from "../utilities/is-type"

/**
 * This scheduler uses either requestAnimationFrame or setTimeout to schedule
 * a rerender at approximately the next frame. These need to be async because
 * a renderer shouldn't block other operations before updating.
 */

export function getScheduler() {
  // Store these in case for some reason they are reassigned later during the page lifecycle.
  const requestAnimationFrame = window.requestAnimationFrame
  const cancelAnimationFrame = window.cancelAnimationFrame
  const setTimeout = window.setTimeout
  const clearTimeout = window.clearTimeout

  // Reference of the scheduler
  let debounced = null

  function runSchedule(fn, requestFn, cancelFn, timeout) {
    if (debounced) {
      debounced = cancelFn(debounced)
    }

    debounced = requestFn(() => {
      fn()
      debounced = null
    }, timeout)
  }

  function schedule(fn) {
    if (isFunction(requestAnimationFrame)) {
      runSchedule(fn, requestAnimationFrame, cancelAnimationFrame)
    } else if (isFunction(setTimeout)) {
      runSchedule(fn, setTimeout, clearTimeout, 1000 / 60)
    }
  }

  return (fn) => schedule(fn)
}
