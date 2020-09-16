window.requestAnimationFrame = jest.fn().mockImplementation((fn) => fn())
window.cancelAnimationFrame = jest.fn().mockImplementation((fn) => fn())
