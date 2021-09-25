import { Socket } from 'phoenix'
import { menuHandler, createAll } from './context_menu'
import { actions } from '../actions'
  
export interface State {
  badgeState: string,
  authoring: boolean
}

var SOCKET
var CHANNEL
const SENDABLE_ACTIONS = [ actions.CREATE_ANNOTATION, actions.ELEMENT_SCREENSHOT ]
var PANEL_PORT: chrome.runtime.Port
var DEVTOOLS_PORT: chrome.runtime.Port

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === 'devtoolsPanel') {
    PANEL_PORT = port
    port.onMessage.addListener(function(message) {
      console.log(`Background received devtools panel ${message.action} message`)
      if (SENDABLE_ACTIONS.includes(message.action)) CHANNEL.push("event:browser_event", message)
      if(message.action == actions.TEST_SELECTOR) sendToFirstTab(message)
    })
  }
  if (port.name === 'devtools') {
    DEVTOOLS_PORT = port
    port.onMessage.addListener(function(message) {
      console.log(`Background received devtools ${message.action} message`)
      chrome.storage.local.get([ 'authoring' ], (result) => {
        if (message.action === actions.ITEM_SELECTED) {
          if (PANEL_PORT) PANEL_PORT.postMessage({ selector: message.selector }) 
          console.log(`sending ${message.action} message`)
          CHANNEL.push("event:browser_event", message)
        }
      })
    })
  }
})

function boot() {
  console.debug("Booting Background Script")
  let state: State = { badgeState: 'none', authoring: false }
  chrome.storage.local.set(state)
  chrome.storage.local.get(['token', 'wsUrl', 'userId'], (result) => {
    SOCKET = new Socket(result.wsUrl, {params: {token: result.token}})
    CHANNEL = SOCKET.channel("user:" + result.userId, {app: "extension"})
    SOCKET.connect()
    CHANNEL.join()
    createAll()
    chrome.contextMenus.onClicked.addListener(menuHandler(CHANNEL))
  })

  chrome.runtime.onMessage.addListener(message => {
    console.log(message)
    if(message.action == actions.GET_AUTH) {
      sendToFirstTab({action: actions.GET_AUTH})
    }
    if(message.action == "sendAuth") {
      const token = message.data.auth.accessToken
      const userId = message.data.auth.userId
      const url = message.data.wsUrl
    }
    chrome.storage.local.get([ 'authoring' ], (result) => {
      const authoring  = result.authoring
      if (message.action) {
        if (message.action === actions.START) start()
        if (message.action === actions.STOP) stop()
        if (message.action === actions.click) {
          console.log(`Pushing Click message if ${authoring} is true`)
          if (authoring) CHANNEL.push("event:browser_event", message)
        }
        if(message.action === actions.keypress) {
          if (authoring) CHANNEL.push("event:browser_event", message)
        }
        if (message.action === actions.load) {
          console.log(`Pushing ${message.action} event if ${authoring} is true`)
          if (authoring) CHANNEL.push("event:browser_event", message)
        }
      }
    })
  })

  chrome.commands.onCommand.addListener((command) => {
    if (command == "save-step") {
      CHANNEL.push("event:browser_event", {action: actions.SAVE_STEP})
    }
  })
}

function sendToFirstTab(message) {
  chrome.tabs.query({ active: true }, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, message);  
  });
}

function start() {
  console.log('start authoring')
  const state: State = { badgeState: 'yes', authoring: true }
  chrome.storage.local.set(state)
  chrome.browserAction.setBadgeText({ text: state.badgeState })
  injectScript()
}

function stop () {
  const state: State = { badgeState: '', authoring: false }
  chrome.storage.local.set(state)
  chrome.browserAction.setBadgeText({text: state.badgeState})
}

function injectScript() {
  chrome.tabs.executeScript({ file: './dist/page.js', allFrames: true })
}

function handleMessage (msg, sender) {
  console.log('HandleMessage')
  if (msg.control) return this.handleControlMessage(msg, sender)

  // to account for clicks etc. we need to record the frameId and url to later target the frame in playback
  msg.frameId = sender ? sender.frameId : null
  msg.frameUrl = sender ? sender.url : null

  if (!this._isPaused) {
    this._recording.push(msg)
    chrome.storage.local.set({ recording: this._recording }, () => {
      console.debug('stored recording updated')
    })
  }
}

boot()