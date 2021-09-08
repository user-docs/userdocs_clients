import * as Recordable from './recordable'
import finder from '@medv/finder'
import { actions } from '../actions'
import { getName } from '../helpers'

declare global {
  interface Window { 
    pptRecorderAddedControlListeners: boolean; 
    sendEvent: Function
  }
}

export function initialize () {
  const events = Object.values(Recordable.events)
  if (!window.pptRecorderAddedControlListeners) {
    addAllListeners(events)
    window.pptRecorderAddedControlListeners = true
  }

  if (!window.pptRecorderAddedControlListeners && chrome.runtime && chrome.runtime.onMessage) {
    window.pptRecorderAddedControlListeners = true
  }
}

export function addAllListeners (events) {
  events.forEach(type => {
    window.addEventListener(type, recordEvent, true)
  })
}

export function recordEvent (e) {
  if(!actions[e.type]) throw new Error(`action ${e.type} not added to actions.ts`)

  const message = {
    selector: getSelector(e),
    value: e.target.value,
    elementName: getName(e.target),
    tagName: e.target.tagName,
    action: actions[e.type],
    keyCode: e.keyCode ? e.keyCode : null,
    href: getWindowLocation(e),
    coordinates: getCoordinates(e)
  }
  
  try {
    chrome.runtime.sendMessage(message)
  } catch (e) {}
}

export function getWindowLocation (e) {
  const eventsWithWindowLocation = { load: true }
  return eventsWithWindowLocation[e.type] ? e.target.location.href : null
}

export function getSelector (e) {
  if (e.target.id) return `#${e.target.id}`

  const eventsWithElements = {
    click: true,
    keydown: true
  }

  if (eventsWithElements[e.type]) {
    const selector = finder(e.target, {
      seedMinLength: 5,
      optimizedMinLength: (e.target.id) ? 2 : 10})
    return selector
  }
  else return null
}


export function getCoordinates (evt) {
  const eventsWithCoordinates = {
    mouseup: true,
    mousedown: true,
    mousemove: true,
    mouseover: true
  }
  return eventsWithCoordinates[evt.type] ? { x: evt.clientX, y: evt.clientY } : null
}

export function generateSelector(element) {
  return finder(element, {
    seedMinLength: 5,
    optimizedMinLength: (element) ? 2 : 10
  })
}