/**
 * @jest-environment node
 */

import * as utils from "../utilities"

const Types = {
  func: "function",
  object: "object",
  string: "string",
  undefined: "undefined",
  null: "null",
  bool: "boolean",
  symbol: "symbol",
  bigint: "bigint",
}

describe("createUUID", () => {
  it("generates a valid id of 18-19 characters", () => {
    const id = utils.createUUID()
    expect(id).toEqual(expect.stringMatching(/[a-zA-Z0-9]{0,19}/))
  })
})

describe("forEach", () => {
  it("iterates over an array", () => {
    let items = [1, 2, 3]
    let originals = []
    utils.forEach(items, (item, idx) => {
      originals[idx] = item
      return (items[idx] = items[idx] * 2)
    })
    expect(originals).toEqual([1, 2, 3])
    expect(items).toEqual([2, 4, 6])
  })

  it("breaks the loop if an iteration returns false", () => {
    const items = [1, 2, 3, 4]
    let endItem = 2
    let unreachableItem = 4
    let maxIdx = items.length - 1
    let earlyReturnIdx

    utils.forEach(items, (item, idx) => {
      // This should never be reached.
      if (item === unreachableItem) {
        earlyReturnIdx = idx
      }

      // This should end the loop.
      if (item === endItem) {
        earlyReturnIdx = idx
        return false
      }
    })

    expect(earlyReturnIdx).toEqual(items.indexOf(endItem))
    expect(earlyReturnIdx).toBeLessThan(maxIdx)
  })
})

describe("camelToKebab", () => {
  it("converts camelCase", () => {
    const camelName = "imACoolCat"
    const kebabName = "im-a-cool-cat"
    expect(utils.camelToKebab(camelName)).toEqual(kebabName)
  })

  it("converts PascalCase", () => {
    const PascalName = "ImACoolCat"
    const kebabName = "im-a-cool-cat"
    expect(utils.camelToKebab(PascalName)).toEqual(kebabName)
  })
})

describe("type checking", () => {
  describe("getTypeTag", () => {
    it("returns 'function' for functions", () => {
      expect(utils.getTypeTag(() => {})).toEqual(Types.func)
    })

    it("returns 'object' for objects", () => {
      expect(utils.getTypeTag({})).toEqual(Types.object)
    })

    it("returns 'string' for strings", () => {
      expect(utils.getTypeTag("")).toEqual(Types.string)
    })

    it("returns 'undefined' for undefined", () => {
      expect(utils.getTypeTag(undefined)).toEqual(Types.undefined)
    })

    it("returns 'null' for null", () => {
      expect(utils.getTypeTag(null)).toEqual(Types.null)
    })

    it("returns 'boolean' for booleans", () => {
      expect(utils.getTypeTag(false)).toEqual(Types.bool)
      expect(utils.getTypeTag(true)).toEqual(Types.bool)
    })

    it("returns 'symbol' for symbols", () => {
      expect(utils.getTypeTag(Symbol())).toEqual(Types.symbol)
    })

    it("returns 'bigint' for big ints", () => {
      expect(utils.getTypeTag(10n)).toEqual(Types.bigint)
    })
  })

  it("isEmptyObject: returns true if the object is empty", () => {
    expect(utils.isEmptyObject({})).toEqual(true)
  })

  it("isEmptyObject: returns false if the object has entries", () => {
    expect(utils.isEmptyObject({ foo: "bar" })).toEqual(false)
  })

  it("isEmptyObject: returns false if the value isn't an object", () => {
    expect(utils.isEmptyObject(() => {})).toEqual(false)
    expect(utils.isEmptyObject(123)).toEqual(false)
    expect(utils.isEmptyObject("")).toEqual(false)
    expect(utils.isEmptyObject(null)).toEqual(false)
    expect(utils.isEmptyObject(undefined)).toEqual(false)
    expect(utils.isEmptyObject(Symbol())).toEqual(false)
  })
})
