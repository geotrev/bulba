import { getScheduler } from "../renderer/scheduler"

/* eslint-disable no-console */
console.info = jest.fn()
const testFnFirst = () => console.info("nice")
const testFnSecond = () => console.info("cool")

const nextFrame = async () =>
  await new Promise((done) => requestAnimationFrame(done))

const timeout = async () =>
  await new Promise((done) => setTimeout(done, 1000 / 60))

describe("scheduler", () => {
  describe("requestAnimationFrame + cancelAnimationFrame", () => {
    it("schedules then runs the given function", async () => {
      const schedule = getScheduler()
      schedule(testFnFirst)
      await nextFrame()
      expect(console.info).toBeCalledWith("nice")
    })

    it("cancels scheduled function if another is called before the end of frame", async () => {
      const schedule = getScheduler()
      schedule(testFnFirst)
      schedule(testFnSecond)
      await nextFrame()
      expect(console.info).toBeCalledTimes(1)
      expect(console.info).toBeCalledWith("cool")
    })
  })

  describe("setTimeout + clearTimeout", () => {
    const animationFrameFn = requestAnimationFrame
    beforeAll(() => (window.requestAnimationFrame = undefined))
    afterAll(() => (window.requestAnimationFrame = animationFrameFn))

    it("schedules then runs the given function", async () => {
      const schedule = getScheduler()
      schedule(testFnFirst)
      await timeout()
      expect(console.info).toBeCalledWith("nice")
    })

    it("cancels scheduled function if another is called before the end of frame", async () => {
      const schedule = getScheduler()
      schedule(testFnFirst)
      schedule(testFnSecond)
      await timeout()
      expect(console.info).toBeCalledTimes(1)
      expect(console.info).toBeCalledWith("cool")
    })
  })
})
