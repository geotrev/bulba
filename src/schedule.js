/**
 * Credit to David Baron for this zero-timeout workaround
 * https://dbaron.org/log/20100309-faster-timeouts
 *
 * This is necessary because the renderer is synchronous (for now) and
 * can cause a lot of DOM thrashing.
 */

export const loadScheduler = () => {
  if (typeof window.scheduleUpgrade === "function") return

  const queue = []
  const EVENT_TYPE = "message"
  const ROTOM_EVENT = "__ROTOM_EVENT__"

  // Like setTimeout, but only takes a function argument.  There's
  // no time argument (always zero) and no arguments (you have to
  // use a closure).
  function schedule(fn) {
    queue.push(fn)
    window.postMessage(ROTOM_EVENT, "*")
  }

  function handleMessageEvent(event) {
    if (event.source == window && event.data == ROTOM_EVENT) {
      event.stopPropagation()
      if (queue.length > 0) {
        const fn = queue.shift()
        requestAnimationFrame(fn)
      }
    }
  }

  window.addEventListener(EVENT_TYPE, handleMessageEvent, true)

  // Add as readonly property - you shall not pass!
  Object.defineProperty(window, "scheduleUpgrade", {
    configurable: false,
    writable: false,
    value: schedule,
  })
}
