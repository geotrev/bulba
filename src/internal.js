// Primitives

export const elementId = Symbol("#elementId")
export const shadowRoot = Symbol("#shadowRoot")
export const vDOM = Symbol("#vDOM")
export const isFirstRender = Symbol("#isFirstRender")
export const isDisconnected = Symbol("#isDisconnected")

// Methods

export const initialize = Symbol("#initialize")
export const getDOMString = Symbol("#getDOMString")
export const getVDOM = Symbol("#getVDOM")
export const schedule = Symbol("#schedule")
export const runLifecycle = Symbol("#runLifecycle")
export const performUpgrade = Symbol("#performUpgrade")
export const upgradeProperty = Symbol("#upgradeProperty")
export const renderStyles = Symbol("#renderStyles")
export const getInitialRenderState = Symbol("#getInitialRenderState")
export const getNextRenderState = Symbol("#getNextRenderState")
export const renderDOM = Symbol("#renderDOM")
