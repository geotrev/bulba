import { isFunction } from "./utilities"

/**
 * Credit to David Baron for this zero-timeout scheduling solution
 * https://dbaron.org/log/20100309-faster-timeouts
 *
 * This is necessary because the renderer shouldn't block
 * other operations before updating.
 */

export const loadScheduler = () => {
  if (typeof window.scheduleComponentUpdate === "function") return

  const setTimeout = window.setTimeout
  const requestAnimationFrame = window.requestAnimationFrame
  const queue = []
  const TIMEOUT_DELAY = 0
  const EVENT_TYPE = "message"
  const MESSAGE_KEY = "__UPDATED_COMPONENT_SCHEDULED__"

  function scheduleUpdate(fn) {
    queue.push(fn)
    window.postMessage(MESSAGE_KEY, "*")
  }

  function handleMessageEvent(event) {
    if (event.source == window && event.data == MESSAGE_KEY) {
      event.stopPropagation()
      if (queue.length > 0) {
        const fn = queue.shift()

        if (isFunction(requestAnimationFrame)) {
          requestAnimationFrame(fn)
        } else if (isFunction(setTimeout)) {
          setTimeout(fn, TIMEOUT_DELAY)
        } else {
          fn()
        }
      }
    }
  }

  window.addEventListener(EVENT_TYPE, handleMessageEvent, true)

  // Add as readonly property - you shall not pass!
  Object.defineProperty(window, "scheduleComponentUpdate", {
    configurable: false,
    writable: false,
    value: scheduleUpdate,
  })
}
