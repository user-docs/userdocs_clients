import { sendCurrentSelector } from "./index";
import { actions } from "../actions"
import { getName, getText } from '../helpers'

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
  .getElementById("element-screenshot")
  .addEventListener('click', (event) => { 
    console.log("Element Screenshot button clicked")
    let element: any = document.getElementById("selector")
    let selector = element.value
    const message = { action: actions.ELEMENT_SCREENSHOT, selector: selector }
    devtools_connection.postMessage(message)
  })

document
  .getElementById("badge")
  .addEventListener('click', (event) => sendAnnotationMessage(event))

document
  .getElementById("outline")
  .addEventListener('click', (event) => sendAnnotationMessage(event))

document
  .getElementById("blur")
  .addEventListener('click', (event) => sendAnnotationMessage(event))

document
  .getElementById("badge-blur")
  .addEventListener('click', (event) => sendAnnotationMessage(event))

document
  .getElementById("badge-outline")
  .addEventListener('click', (event) => sendAnnotationMessage(event))

function sendAnnotationMessage(event) {
  const element: any = document.getElementById("selector")
  const selector = element.value
  const annotationType = event.target.innerText
  chrome.devtools.inspectedWindow.eval(retreiveElementName(selector), (result, isException) => {
    if (isException) console.log(isException)
    const message = { 
      elementName: result, 
      action: actions.CREATE_ANNOTATION, 
      annotationType: annotationType, 
      selector: selector 
    }
    devtools_connection.postMessage(message)
  })
}

function retreiveElementName(selector) {
  return getText.toString() + " " + getName.toString() + ` {name: getName(document.querySelector('${selector}'))}`
}