import { actions } from '../actions'

const SCREENSHOT_ID = 'SCREENSHOT'
const ELEMENT_SCREENSHOT_ID = 'ELEMENT_SCREENSHOT'
const BADGE_ID = "BADGE"
const OUTLINE_ID = "OUTLINE"
const BADGE_OUTLINE_ID = "BADGE_OUTLINE"
const BLUR_ID = "BLUR"
const BADGE_BLUR_ID = "BADGE_BLUR"
var ACTION_MAP = {}
ACTION_MAP[SCREENSHOT_ID] = {action: actions.FULL_SCREEN_SCREENSHOT}
ACTION_MAP[ELEMENT_SCREENSHOT_ID] = {action: actions.ELEMENT_SCREENSHOT}
ACTION_MAP[BADGE_ID] = {annotationType: "Badge", action: actions.CREATE_ANNOTATION}
ACTION_MAP[OUTLINE_ID] = {annotationType: "Outline", action: actions.CREATE_ANNOTATION}
ACTION_MAP[BADGE_OUTLINE_ID] = {annotationType: "Badge Outline", action: actions.CREATE_ANNOTATION}
ACTION_MAP[BLUR_ID] = {annotationType: "Blur", action: actions.CREATE_ANNOTATION}
ACTION_MAP[BADGE_BLUR_ID] = {annotationType: "Badge Blur", action: actions.CREATE_ANNOTATION}

export function createAll() {
  chrome.contextMenus.removeAll()
  chrome.contextMenus.create({
    id: SCREENSHOT_ID,
    title: 'Full Screen Screenshot',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: ELEMENT_SCREENSHOT_ID,
    title: 'Element Screenshot',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: BADGE_ID,
    title: 'Badge Element',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: OUTLINE_ID,
    title: 'Outline Element',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: BADGE_OUTLINE_ID,
    title: 'Badge + Outline Element',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: BLUR_ID,
    title: 'Blur Element',
    contexts: ['all']
  })
  chrome.contextMenus.create({
    id: BADGE_BLUR_ID,
    title: 'Badge + Blur Element',
    contexts: ['all']
  })
}


export function menuHandler(channel) {
  function apply(info) {
    console.log(`Menu Interaction with ${JSON.stringify(info)}`)
    chrome.tabs.query({ active: true }, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: actions.GET_CLICKED_ELEMENT}, result => {
        const message = Object.assign(result, ACTION_MAP[info.menuItemId])
        console.log(message)
        channel.push("event:browser_event", message)
      });  
    });
  }
  return apply
}