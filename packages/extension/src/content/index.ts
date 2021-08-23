import { actions } from '../actions';
import * as Recorder from './recorder'
import {Socket, Channel} from 'phoenix'

declare global {
  interface Window { 
    eventRecorder: any;
    generateSelector: Function;
  }
}

var port = chrome.runtime.connect();

function boot() {
  console.log("Starting Content Script")
  window.eventRecorder = Recorder
  window.eventRecorder.initialize()
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('dist/page.js');
  s.onload = function() {
      (this as any).remove();
  };
  (document.head || document.documentElement).appendChild(s);
  chrome.runtime.sendMessage({action: actions.GET_AUTH})
}

window.generateSelector = Recorder.generateSelector 
window.addEventListener("message", (event) => {
  // We only accept messages from ourselves
  if (event.source != window) return;
  if (event.data.type) {port.postMessage(event.data.text);}
  if (event.data.action == "sendAuth") {chrome.runtime.sendMessage(event.data)}
}, false);

chrome.runtime.onMessage.addListener(msg => { 
  let logString = "Content Script received a message."
  if (msg.action) {
    if (msg.action === actions.GET_AUTH) window.postMessage(msg, "*");
  }
})

boot()
