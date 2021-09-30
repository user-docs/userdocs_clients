import * as Recorder from './recorder'
import { actions } from '../actions'
import { parseElementMessage, parseMessage } from '../helpers'

declare global {
  interface Window { 
    eventRecorder: any;
    generateSelector: Function;
    parseElementMessage: Function;
    highlightedElement: HTMLElement;
    clickedElement: any,
    message: object
  }
}

console.log("Starting Content Script")

window.eventRecorder = Recorder
window.eventRecorder.initialize()
window.generateSelector = Recorder.generateSelector
window.parseElementMessage = parseElementMessage

window.addEventListener('message', function (message: MessageEvent) {
  if(message.data.action == 'putToken') {
    chrome.storage.local.set({token: message.data.action.token})
  }
  if(message.data.action == 'START_RUNNING') {
    this.chrome.runtime.sendMessage({ action: actions.START_RUNNING })
  }
  if(message.data.action == 'STOP_RUNNING') {
    this.chrome.runtime.sendMessage({ action: actions.STOP_RUNNING })
  }
})

document.addEventListener("contextmenu", (event) => {
  window.clickedElement = event.target
  window.message = parseMessage(event)
}, true)

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) { 
  if (message.action && message.action == actions.TEST_SELECTOR) {
    const element: HTMLElement = document.querySelector(message.selector)
    if (window.highlightedElement){
      console.log("There's a highlighted element")
      window.highlightedElement.style.outline = ''
      window.highlightedElement.style.outlineOffset = ''
    }
    element.setAttribute('style', 'outline: 2px orange dashed !important')
    element.style.outlineOffset = '-1px !important'
    window.highlightedElement = element
  } else if (message.action && message.action == actions.GET_CLICKED_ELEMENT) {
    const message = window.message
    sendResponse(message)
  }
})

chrome.storage.local.set({
  userId: localStorage.userId,
  token: localStorage.token,
  wsUrl: localStorage.wsUrl,
})
/*
var s = document.createElement('script');
s.src = chrome.runtime.getURL('dist/page.js');
s.onload = function() {
    (this as any).remove();
};

(document.head || document.documentElement).appendChild(s);
*/
