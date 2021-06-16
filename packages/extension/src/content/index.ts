import * as Recorder from './recorder'

declare global {
  interface Window { 
    eventRecorder: any;
    testContent: Function; 
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
  console.log(msg)
  if (msg.action === 'CREATE_ANNOTATION') {
    window.postMessage({ detail: msg }, "*");
  }
  if (msg.action && msg.action == 'itemSelected') window.postMessage({ detail: msg }, "*")
})

window.testContent = Recorder.testContent 
