import { actions } from '../actions'

console.log('Injected page script')

const STATE = {
  highlightedElement: null
}

const SENDABLE_ACTIONS = [ actions.CREATE_ANNOTATION, actions.click, actions.load, actions.ITEM_SELECTED, actions.ELEMENT_SCREENSHOT ]

window.addEventListener('message', function (message: MessageEvent) {
  if(SENDABLE_ACTIONS.includes(message.data.action)) {
    console.log(`Page Script processing sendable message ${message.data.action}`)
    try {
      window.sendEvent(message.data) 
    } catch(e) {
      console.error(new Error("Message failed to send"))
      console.error(message.data)
    }
  }
  else if(message.data.action === actions.TEST_SELECTOR) {
    const element: HTMLElement = document.querySelector(message.data.selector)

    if (STATE.highlightedElement){
      console.log("There's a highlighted element")
      STATE.highlightedElement.style.outline = ''
      STATE.highlightedElement.style.outlineOffset = ''
    }

    element.setAttribute('style', 'outline: 2px orange dashed !important')
    element.style.outlineOffset = '-1px !important'
    
    STATE.highlightedElement = element
  }
  else {
    let logString = `An Unsupported message was posted to the window. `
    try { logString = logString + `The messages action was ${message.data.action}` } 
    catch(e) { console.error(e) }
    console.error(logString)
  }
})