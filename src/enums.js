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
  validateType: "validateType",
  staticProperties: "properties",
  staticStyles: "styles",

  // Attributes
  rotomIdAttribute: "rotom-id",

  // Lifecycle
  elementDidConnect: "elementDidConnect",
  elementDidMount: "elementDidMount",
  elementDidUpdate: "elementDidUpdate",
  elementPropertyChanged: "elementPropertyChanged",
  elementAttributeChanged: "elementAttributeChanged",
  elementWillUnmount: "elementWillUnmount",
}

export const Internal = {
  // Primitives
  rotomId: Symbol("#rotomId"),
  vDOM: Symbol("#vDOM"),
  isFirstRender: Symbol("#isFirstRender"),

  // Methods
  renderer: Symbol("#renderer"),
  initialize: Symbol("#initialize"),
  schedule: Symbol("#schedule"),
  runPossibleConstructorMethod: Symbol("#runPossibleConstructorMethod"),
  upgrade: Symbol("#upgrade"),
  upgradeProperties: Symbol("#upgradeProperties"),
  renderStyles: Symbol("#renderStyles"),
  renderDOM: Symbol("#renderDOM"),
  patch: Symbol("#patch"),
  destroy: Symbol("#destroy"),
}
