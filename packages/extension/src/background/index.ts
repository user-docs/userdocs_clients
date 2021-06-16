export interface State {
  badgeState: string,
  width: number,
  height: number
}

const MENU_ID = 'USERDOCS_ASSISTANT_CONTEXT_MENU'
const SCREENSHOT_ID = 'SCREENSHOT'
const ELEMENT_SCREENSHOT_ID = 'ELEMENT_SCREENSHOT'
const ANNOTATE_ID = 'ANNOTATE'

const actions = {
  START: 'START',
  STOP: 'STOP',
  CREATE_ANNOTATION: 'CREATE_ANNOTATION'
}

var STATE: State
var DEVTOOLS_PANEL_PORT: chrome.runtime.Port

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === 'devtoolsPanel') {
    console.log("DTP Open")
    DEVTOOLS_PANEL_PORT = port
    port.onMessage.addListener(function(message) {
      console.log("Background received devtools message")
      if (message.action === actions.CREATE_ANNOTATION) {
        console.log("CA to content script")
        chrome.tabs.query({ active: true }, function(tabs){
          console.log(tabs)
          chrome.tabs.sendMessage(tabs[0].id, message);  
        });
      }
    })
  }
})

function boot() {
  console.debug("Booting Background Script")
  STATE = {badgeState: 'none', width: 500, height: 500}
  chrome.runtime.onMessage.addListener(msg => {
    if (msg.action && msg.action === actions.START) this.start()
    if (msg.action && msg.action === actions.STOP) this.stop()
    if (msg === 'startAuthoring')  start()
    if (msg.action && msg.action === 'itemSelected') {
      chrome.tabs.query({ active: true }, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, msg);  
      });
      if (DEVTOOLS_PANEL_PORT) DEVTOOLS_PANEL_PORT.postMessage({ selector: msg.selector })
    }
  })
}

function start() {
  console.log('start recording')
  STATE.badgeState = 'rec'

  chrome.browserAction.setBadgeText({ text: STATE.badgeState })

  chrome.contextMenus.removeAll()

  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'UserDocs Assistant',
    contexts: ['all']
  })

  chrome.contextMenus.create({
    id: MENU_ID + SCREENSHOT_ID,
    title: 'Take Screenshot (Ctrl+Shift+S)',
    parentId: MENU_ID,
    contexts: ['all']
  })

  chrome.contextMenus.create({
    id: MENU_ID + ELEMENT_SCREENSHOT_ID,
    title: 'Take Element Screenshot (Ctrl+Shift+E)',
    parentId: MENU_ID,
    contexts: ['all']
  })

  chrome.contextMenus.create({
    id: MENU_ID + ANNOTATE_ID,
    title: 'Apply Annotation (Ctrl+Shift+A)',
    parentId: MENU_ID,
    contexts: ['all']
  })

  chrome.contextMenus.onClicked.addListener(menuInteractionhandler)

  injectScript()
}

function injectScript() {
  chrome.tabs.executeScript({ file: './dist/page.js', allFrames: true })
}

function menuInteractionhandler(info, tab) {
  console.log(`Menu Interaction with ${info.menuItemId}`)
}

function handleMessage (msg, sender) {
  console.log('HandleMessage')
  if (msg.control) return this.handleControlMessage(msg, sender)

  // to account for clicks etc. we need to record the frameId and url to later target the frame in playback
  msg.frameId = sender ? sender.frameId : null
  msg.frameUrl = sender ? sender.url : null

  console.log(msg)

  if (!this._isPaused) {
    this._recording.push(msg)
    chrome.storage.local.set({ recording: this._recording }, () => {
      console.debug('stored recording updated')
    })
  }
}

boot()