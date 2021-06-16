import { sendCurrentSelector } from "./index";


// Startup
var devtools_connection = chrome.runtime.connect({name: 'devtoolsPanel'});
sendCurrentSelector()

devtools_connection.onMessage.addListener((message) => {
  let element = document.getElementById("selector")
  element.innerText = message.selector
});

document
  .getElementById("badge")
  .addEventListener('click', (event) => { 
    let selector = document.getElementById("selector").innerText
    const message = { action: "CREATE_ANNOTATION", type: "Badge", selector: selector }
    devtools_connection.postMessage(message)
  })

document
  .getElementById("badge")
  .addEventListener('click', (event) => { 
    let selector = document.getElementById("selector").innerText
    const message = { action: "CREATE_ANNOTATION", annotationType: "Badge", selector: selector }
    devtools_connection.postMessage(message)
  })
