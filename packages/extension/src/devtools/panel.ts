import { sendCurrentSelector } from "./index";
import { actions } from "../actions"

var STATE = {
  currentElement: null
}

var devtools_connection = chrome.runtime.connect({name: 'devtoolsPanel'});
sendCurrentSelector()

devtools_connection.onMessage.addListener((message) => {
  let element: any = document.getElementById("selector")
  element.value = message.selector
});

document
  .getElementById('testSelector')
  .addEventListener('click', (event) => { 
    console.log('Background script testing selector')
    let element: any = document.getElementById("selector")
    let message = { action: actions.TEST_SELECTOR, selector: element.value }
    devtools_connection.postMessage(message)
  })

document
  .getElementById("badge")
  .addEventListener('click', (event) => { 
    let element: any = document.getElementById("selector")
    let selector = element.value
    const message = { action: actions.CREATE_ANNOTATION, annotationType: "Badge", selector: selector }
    devtools_connection.postMessage(message)
  })

document
  .getElementById("outline")
  .addEventListener('click', (event) => { 
    let element: any = document.getElementById("selector")
    let selector = element.value
    const message = { action: actions.CREATE_ANNOTATION, annotationType: "Outline", selector: selector }
    devtools_connection.postMessage(message)
  })

document
  .getElementById("element-screenshot")
  .addEventListener('click', (event) => { 
    console.log("Element Screenshot button clicked")
    let element: any = document.getElementById("selector")
    let selector = element.value
    const message = { action: actions.ELEMENT_SCREENSHOT, selector: selector }
    devtools_connection.postMessage(message)
  })
