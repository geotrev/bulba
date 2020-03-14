/**
 * Credit to David Baron for this zero-timeout workaround
 * https://dbaron.org/log/20100309-faster-timeouts
 *
 * This is necessary because the renderer is synchronous (for now) and
 * can cause a lot of DOM thrashing.
 */

export const loadScheduler = () => {
  if (typeof window.scheduleComponentUpdate === "function") return

  const setTimeout = window.setTimeout
  const requestAnimationFrame = window.requestAnimationFrame
  const queue = []
  const EVENT_TYPE = "message"
  const UPDATED_COMPONENT_EVENT = "__UPDATED_COMPONENT_SCHEDULED__"

  function scheduleUpdate(fn) {
    queue.push(fn)
    window.postMessage(UPDATED_COMPONENT_EVENT, "*")
  }

  function handleMessageEvent(event) {
    if (event.source == window && event.data == UPDATED_COMPONENT_EVENT) {
      event.stopPropagation()
      if (queue.length > 0) {
        const fn = queue.shift()

        if (typeof requestAnimationFrame === "function") {
          requestAnimationFrame(fn)
        } else if (typeof setTimeout === "function") {
          setTimeout(fn, 0)
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
