export const createUUID = () => {
  const x = Number.MAX_SAFE_INTEGER
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Date.now()).toString(36)
}

export const toCamel = value => {
  return value.replace(/([-_][a-z])/gi, $1 =>
    $1
      .toUpperCase()
      .replace("-", "")
      .replace("_", "")
  )
}

export const toKebab = value => {
  return value.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase()
}

/**
 * Credit to David Baron for this zero-timeout scheduler
 * https://dbaron.org/log/20100309-faster-timeouts
 */

// Only add zerro timeout scheduler to the window object, and hide everything else in a closure.
export const loadScheduler = () => {
  if (typeof window.schedule === "function") return

  const timeouts = []
  const EVENT_TYPE = "message"
  const ROTOM_EVENT = "__ROTOM_EVENT__"

  // Like setTimeout, but only takes a function argument.  There's
  // no time argument (always zero) and no arguments (you have to
  // use a closure).
  function schedule(fn) {
    timeouts.push(fn)
    window.postMessage(ROTOM_EVENT, "*")
  }

  function handleMessageEvent(event) {
    if (event.source == window && event.data == ROTOM_EVENT) {
      event.stopPropagation()
      if (timeouts.length > 0) {
        const fn = timeouts.shift()
        fn()
      }
    }
  }

  window.addEventListener(EVENT_TYPE, handleMessageEvent, true)

  // Add the one thing we want added to the window object.
  window.schedule = schedule
}
