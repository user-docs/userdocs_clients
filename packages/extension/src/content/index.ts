import * as Recorder from './recorder'
import { actions } from '../actions'

declare global {
  interface Window { 
    eventRecorder: any;
    generateSelector: Function;
    highlightedElement: HTMLElement;
  }
}

console.log("Starting Content Script")

var port = chrome.runtime.connect();

window.eventRecorder = Recorder
window.eventRecorder.initialize()
window.generateSelector = Recorder.generateSelector 

window.addEventListener('message', function (message: MessageEvent) {
  if(message.data.action == 'putToken') {
    chrome.storage.local.set({token: message.data.action.token})
  }
})

chrome.runtime.onMessage.addListener(message => { 
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
