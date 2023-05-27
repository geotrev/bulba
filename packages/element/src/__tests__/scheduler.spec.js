import { createScheduler } from "../scheduler"
import { jest } from "@jest/globals"

/* eslint-disable no-console */
console.info = jest.fn()
const nextFrame = async () =>
  await new Promise((done) => requestAnimationFrame(done))
const timeout = async () =>
  await new Promise((done) => setTimeout(done, 1000 / 60))

const testFnFirst = () => console.info("nice")
const testFnSecond = () => console.info("cool")

describe("scheduler", () => {
  describe("requestAnimationFrame + cancelAnimationFrame", () => {
    it("schedules then runs the given function", async () => {
      // Given
      const schedule = createScheduler()
      // When
      schedule(testFnFirst)
      await nextFrame()
      // Then
      expect(console.info).toHaveBeenCalledWith("nice")
    })

    it("cancels scheduled function if another is called before the end of frame", async () => {
      // Given
      const schedule = createScheduler()
      // When
      schedule(testFnFirst)
      schedule(testFnSecond)
      await nextFrame()
      // Then
      expect(console.info).toHaveBeenCalledTimes(1)
      expect(console.info).toHaveBeenCalledWith("nice")
    })
  })

  describe("setTimeout + clearTimeout", () => {
    const animationFrameFn = requestAnimationFrame
    beforeAll(() => (window.requestAnimationFrame = undefined))
    afterAll(() => (window.requestAnimationFrame = animationFrameFn))

    it("schedules then runs the given function", async () => {
      // Given
      const schedule = createScheduler()
      // When
      schedule(testFnFirst)
      await timeout()
      // Then
      expect(console.info).toHaveBeenCalledWith("nice")
    })

    it("cancels scheduled function if another is called before the end of frame", async () => {
      // Given
      const schedule = createScheduler()
      // When
      schedule(testFnFirst)
      schedule(testFnSecond)
      await timeout()
      // Then
      expect(console.info).toHaveBeenCalledTimes(1)
      expect(console.info).toHaveBeenCalledWith("nice")
    })
  })
})
