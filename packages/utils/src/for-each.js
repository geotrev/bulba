/**
 * Simplified lodash implementation.
 * If `false` is explicitly returned, break the loop.
 * @param {[]} items
 * @param fn
 */
export const forEach = (items, fn) => {
  const length = items.length
  if (!length) return
  let idx = -1
  while (++idx < length) {
    if (fn(items[idx], idx) === false) break
  }
}
