import * as Recordable from './recordable'
import finder from '@medv/finder'
import { actions } from '../actions'

declare global {
  interface Window { 
    pptRecorderAddedControlListeners: boolean; 
    sendEvent: Function
  }
}

export function initialize () {
  console.log("Initializing")
  const events = Object.values(Recordable.events)
  if (!window.pptRecorderAddedControlListeners) {
    console.log("adding listeners")
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
  console.log('recordEvent fired')
  if(!actions[e.type]) throw new Error(`action ${e.type} not added to actions.ts`)

  const message = {
    selector: getSelector(e),
    value: e.target.value,
    tagName: e.target.tagName,
    action: actions[e.type],
    keyCode: e.keyCode ? e.keyCode : null,
    href: getWindowLocation(e),
    coordinates: getCoordinates(e)
  }
  
  try {
    sendMessage(message)
  } catch (e) {}
}


export async function sendMessage (msg) {
  console.log("SendMessage called")
  window.postMessage({ from: "UserDocs", detail: msg }, "*");

  try {
  } catch(e) {
    console.log("error")
    console.log(e)
  }
}

export function getWindowLocation (e) {
  const eventsWithWindowLocation = {
    load: true
  }

  console.log(`href is ${eventsWithWindowLocation[e.type] ? e.target.location.href : null}`)

  return eventsWithWindowLocation[e.type] ? e.target.location.href : null
}


export function getSelector (e) {
  if (e.target.id) {
    return `#${e.target.id}`
  }

  const eventsWithElements = {
    click: true,
    keydown: true
  }

  return eventsWithElements[e.type] ? finder(e.target, {
    seedMinLength: 5,
    optimizedMinLength: (e.target.id) ? 2 : 10
  }) : null
}


export function getCoordinates (evt) {
  console.log('getCoordinates')
  console.log(evt)
  const eventsWithCoordinates = {
    mouseup: true,
    mousedown: true,
    mousemove: true,
    mouseover: true
  }
  return eventsWithCoordinates[evt.type] ? { x: evt.clientX, y: evt.clientY } : null
}

export function testContent(element) {
  return finder(element, {
    seedMinLength: 5,
    optimizedMinLength: (element) ? 2 : 10
  })
}
