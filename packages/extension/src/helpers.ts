export function getName (element) {
  var texts = []
  getText(element, texts)
  if (texts[0]) return texts[0]
  else if (element.name) return element.name
  else return ""
}

export function getText(node, accumulator) {
  if (node.nodeType === 3) // 3 == text node
    accumulator.push(node.nodeValue)
  else
    for (let child of node.childNodes)
      getText(child, accumulator)
}