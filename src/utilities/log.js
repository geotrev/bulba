/**
 * Logs a message of the specified type
 * @param {string} msg
 * @param {string} type
 */
export function log(msg, type = "warn") {
  // eslint-disable-next-line no-console
  console[type](`[Rotom]: ${msg}`)
}
