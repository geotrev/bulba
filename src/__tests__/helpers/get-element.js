export function getElement(tagName, getShadowRoot = true) {
  const element = document.querySelector(`test-${tagName}`)
  return getShadowRoot ? element.shadowRoot : element
}
