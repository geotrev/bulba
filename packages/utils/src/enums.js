export const Attributes = {
  dir: "dir",
}

export const AttributeValues = {
  ltr: "ltr",
}

export const External = {
  // Properties & methods
  bulbaIdProperty: "bulbaId",
  requestRender: "requestRender",
  render: "render",
  staticProperties: "properties",
  staticStyles: "styles",

  // Attributes
  bulbaIdAttribute: "bulba-id",

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
  bulbaId: Symbol("#bulbaId"),
  vnode: Symbol("#vnode"),
  isFirstRender: Symbol("#isFirstRender"),
  reflectMap: Symbol("#reflectMap"),

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
