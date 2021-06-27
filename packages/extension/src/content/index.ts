import { actions } from '../actions';
import * as Recorder from './recorder'

declare global {
  interface Window { 
    eventRecorder: any;
    generateSelector: Function;
  }
}

var port = chrome.runtime.connect();

window.addEventListener("message", (event) => {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type) {
    console.log("Content script received: " + event.data.text);
    port.postMessage(event.data.text);
  }
}, false);

console.log("Injecting Content Script")
window.eventRecorder = Recorder
window.eventRecorder.initialize()
var s = document.createElement('script');
s.src = chrome.runtime.getURL('dist/page.js');
s.onload = function() {
    (this as any).remove();
};
(document.head || document.documentElement).appendChild(s);

chrome.runtime.onMessage.addListener(msg => { 
  let logString = "Content Script received a message."
  if (msg.action) {
    if (msg.action === actions.CREATE_ANNOTATION) window.postMessage(msg, "*");
    if (msg.action === actions.ELEMENT_SCREENSHOT) window.postMessage(msg, "*");
    if (msg.action == actions.ITEM_SELECTED) window.postMessage(msg, "*");
    if (msg.action == actions.TEST_SELECTOR) window.postMessage(msg, "*");
    if (msg.action == actions.click) window.postMessage(msg, "*");
    if (msg.action == actions.load) window.postMessage(msg, "*");
  }
})

window.generateSelector = Recorder.generateSelector 
