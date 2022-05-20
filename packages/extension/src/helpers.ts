import finder from '@medv/finder'
import { actions } from './actions'

export function parseMessage(e) {
  const keycode = e.keyCode ? e.keyCode : null
  return {
    selector: getSelector(e.target),
    value: e.target.value + String.fromCharCode(keycode),
    elementName: getName(e.target),
    tagName: e.target.tagName,
    action: actions[e.type],
    keyCode: keycode,
    href: getElementLocation(e.target),
    pageTitle: getPageTitle(),
    coordinates: getCoordinates(e)
  }
}

export function parseElementMessage(element) {
  return {
    selector: getSelector(element),
    elementName: getName(element),
    tagName: element.tagName,
    href: getElementLocation(element),
    pageTitle: getPageTitle()
  }
}

export function getWindowLocation() { return window.location.href }

function getElementLocation (element) {
  return element.location ? element.location.href : window.location.href
}

function getPageTitle() {return document.title}

function getSelector (element) {
  if (element.id) return `#${element.id}`
  try {
    const selector = finder(element, {
      seedMinLength: 5,
      optimizedMinLength: (element.id) ? 2 : 10})
    return selector
  } catch(e) {
    console.log(e)
    return null
  }
}


function getCoordinates (evt) {
  const eventsWithCoordinates = {
    mouseup: true,
    mousedown: true,
    mousemove: true,
    mouseover: true
  }
  return eventsWithCoordinates[evt.type] ? { x: evt.clientX, y: evt.clientY } : null
}

export function getName (element) {
  var texts = []
  getText(element, texts)
  if (texts[0]) return texts[0]
  else if (element.name) return element.name.trim()
  else return ""
}

export function getText(node, accumulator) {
  if (node.nodeType === 3) // 3 == text node
    accumulator.push(node.nodeValue)
  else
    for (let child of node.childNodes)
      getText(child, accumulator)
}