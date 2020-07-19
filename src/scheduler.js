import { isFunction } from "./utilities"

/**
 * Credit to Chris Ferdinandi for this nifty requestAnimationFrom implementation
 * https://gomakethings.com/how-to-batch-ui-rendering-in-a-reactive-state-based-ui-component-with-vanilla-js/?mc_cid=2f4adb5d09&mc_eid=[UNIQID]
 *
 * Formerly used this setTimeout idea with postMessage:
 * https://dbaron.org/log/20100309-faster-timeouts
 *
 * Not using for now because each component shouldn't have a need to be concerned
 * with the rest of the page. Allow each copmonent to manage its own render
 * state, and rely on consumers to pass data top-down for correct page DOM state.
 *
 * requestAnimationFrame is async. This is necessary because a renderer shouldn't
 * block other operations before updating.
 *
 * Most other syncronous operations are dealt with independent of the animation
 * frame, so renders will always be deferred for at least some increment of
 * 0-16/17 milliseconds, leading to smoother updates of non-render related
 * events, such as clicks and the like.
 */

export function getScheduler() {
  // Store these in case for some reason they are reassigned later during the page lifecycle.
  const requestAnimationFrame = window.requestAnimationFrame
  const cancelAnimationFrame = window.cancelAnimationFrame
  const setTimeout = window.setTimeout
  let debounced = null

  function schedule(fn) {
    if (isFunction(requestAnimationFrame)) {
      if (debounced) {
        cancelAnimationFrame(debounced)
      }

      debounced = requestAnimationFrame(fn)
    } else if (isFunction(setTimeout)) {
      if (debounced) {
        clearTimeout(debounced)
      }

      debounced = setTimeout(fn, 1000 / 60)
    }
  }

  // Add as readonly property - you shall not pass!
  return fn => schedule(fn)
}
