import { forEach } from "../../../utilities"

/**
 * Given a matcher to a vnode property, apply it to the
 * appropriate snabbdom module.
 * @param {Object} vnode
 * @param {RegExp} matcher
 * @param {Function} transformer
 */
export function setPropToModule(vnode, matcher, transformer) {
  const matches = []

  if (vnode.data) {
    for (const key in vnode.data) {
      if (matcher.test(key))
        matches.push({
          key,
          value: vnode.data[key],
          node: vnode,
        })
    }

    forEach(matches, transformer)
  }

  if (Array.isArray(vnode.children)) {
    forEach(vnode.children, (child) =>
      setPropToModule(child, matcher, transformer)
    )
  }

  return vnode
}
