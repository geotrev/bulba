/**
 * Generates a unique 19 digit ID based on Date.now() and MAX_SAFE_INTEGER
 * @returns {string}
 */
export const createUUID = () => {
  const base = Number.MAX_SAFE_INTEGER
  return (
    Math.floor(Math.random() * base).toString(36) +
    Math.abs(Date.now()).toString(36)
  )
}
