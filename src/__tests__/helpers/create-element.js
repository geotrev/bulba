export function createElement(tagName, attributes = {}) {
  const fixture = document.createElement(tagName)

  if (Object.keys(attributes).length) {
    for (const name in attributes) {
      fixture.setAttribute(name, attributes[name])
    }
  }

  return fixture
}
