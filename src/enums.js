export const Attributes = {
  dir: "dir",
}

export const AttributeValues = {
  ltr: "ltr",
}

export const External = {
  // Properties & methods
  rotomIdProperty: "rotomId",
  requestRender: "requestRender",
  render: "render",
  staticProperties: "properties",
  staticStyles: "styles",

  // Attributes
  rotomIdAttribute: "rotom-id",

  // Lifecycle
  onConnect: "onConnect",
  onMount: "onMount",
  onUpdate: "onUpdate",
  onPropertyChange: "onPropertyChange",
  onAttributeChange: "onAttributeChange",
  onUnmount: "onUnmount",
}

export const Internal = {
  // Properties
  rotomId: Symbol("#rotomId"),
  vnode: Symbol("#vnode"),
  isFirstRender: Symbol("#isFirstRender"),
  propMap: Symbol("#propMap"),

  // Methods
  renderer: Symbol("#renderer"),
  initialize: Symbol("#initialize"),
  schedule: Symbol("#schedule"),
  runLifecycle: Symbol("#runLifecycle"),
  upgrade: Symbol("#upgrade"),
  upgradeProperties: Symbol("#upgradeProperties"),
  renderStyles: Symbol("#renderStyles"),
  renderDOM: Symbol("#renderDOM"),
  patch: Symbol("#patch"),
  destroy: Symbol("#destroy"),
}
