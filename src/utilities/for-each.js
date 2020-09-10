/**
 * Simplified lodash implementation.
 * If `false` is explicitly returned, break the loop.
 * @param {[]} items
 * @param fn
 */
export const forEach = (items, fn) => {
  let idx = -1
  const length = items.length
  while (++idx < length) {
    if (fn(items[idx], idx) === false) break
  }
}
