// Primitives

export const elementId = Symbol("#elementId")
export const shadowRoot = Symbol("#shadowRoot")
export const vDOM = Symbol("#vDOM")
export const isFirstRender = Symbol("#isFirstRender")
export const cleanup = Symbol("#cleanup")

// Methods

export const initialize = Symbol("#initialize")
export const getDOMString = Symbol("#getDOMString")
export const getVDOM = Symbol("#getVDOM")
export const schedule = Symbol("#schedule")
export const runLifecycle = Symbol("#runLifecycle")
export const performUpgrade = Symbol("#performUpgrade")
export const upgradeProperty = Symbol("#upgradeProperty")
export const renderStyles = Symbol("#renderStyles")
export const setInitialRenderState = Symbol("#setInitialRenderState")
export const setNextRenderState = Symbol("#setNextRenderState")
export const renderDOM = Symbol("#renderDOM")
