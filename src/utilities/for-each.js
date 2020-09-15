/**
 * Simplified lodash implementation.
 * If `false` is explicitly returned, break the loop.
 * @param {[]} items
 * @param fn
 */
export const forEach = (items, fn) => {
  let idx = -1
  const length = items.length
  if (!length) return
  while (++idx < length) {
    if (fn(items[idx], idx) === false) break
  }
}
