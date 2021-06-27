export const Attributes = {
  dir: "dir",
}

export const AttributeValues = {
  ltr: "ltr",
}

export const External = {
  // Properties & methods
  elementIdProperty: "elementId",
  requestRender: "requestRender",
  render: "render",
  validateType: "validateType",
  staticProperties: "properties",
  staticStyles: "styles",

  // Attributes
  elementIdAttribute: "rotom-id",

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
  elementId: Symbol("#elementId"),
  shadowRoot: Symbol("#shadowRoot"),
  vDOM: Symbol("#vDOM"),
  isFirstRender: Symbol("#isFirstRender"),
  destroy: Symbol("#destroy"),
  renderer: Symbol("#renderer"),

  // Methods
  initialize: Symbol("#initialize"),
  setRenderer: Symbol("#setRenderer"),
  schedule: Symbol("#schedule"),
  runPossibleConstructorMethod: Symbol("#runPossibleConstructorMethod"),
  upgrade: Symbol("#upgrade"),
  upgradeProperties: Symbol("#upgradeProperties"),
  renderStyles: Symbol("#renderStyles"),
  renderDOM: Symbol("#renderDOM"),
  patch: Symbol("#patch"),
}
