import * as Recordable from './recordable'
import finder from '@medv/finder'
import { actions } from '../actions'
import { parseMessage } from '../helpers'

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
  const message = parseMessage(e)
  try {
    chrome.runtime.sendMessage(message)
  } catch (e) {}
}

export function generateSelector(element) {
  return finder(element, {
    seedMinLength: 5,
    optimizedMinLength: (element) ? 2 : 10
  })
}