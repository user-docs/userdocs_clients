import { app, BrowserWindow, session } from 'electron'
import { loginAPI, loginUI } from './login'
import * as keytar from 'keytar';

const isDev = require('electron-is-dev');
const path = require('path')

export async function createMainWindow (state) {  
  app.commandLine.appendSwitch('ignore-certificate-errors');
  try {
    state.window = await new BrowserWindow({
      width: 1600,
      height: 800,
      webPreferences: {
        preload: require('path').join(__dirname, './preload.js')
      }
    })
  } catch(e) {
    state.error = e
  }
  return state
}

export async function getTokens (state) {
  if (state.status != 'ok') { return state }

  try {
    state.tokens.access_token = await keytar.getPassword('UserDocs', 'accessToken')
    state.tokens.renewal_token = await keytar.getPassword('UserDocs', 'renewalToken')
  } catch (e) {
    state.status = "tokenFetchFailed"
    state.error = e
  }
  return state
}

export async function getSession(state) {
  if (state.status != 'ok') { return state }

  try {
    const response = await loginUI(state.tokens.access_token, state.url)
    var cookie = parseCookies(response.headers)
    cookie.url = state.url
    cookie.name = '_userdocs_web_key'
    cookie.value = cookie._userdocs_web_key
    delete cookie._userdocs_web_key
    state.cookie = cookie
  } catch(e) {
    state.status = "loginFailed"
    state.error = e
  }
  return state
}

export async function putSession(state) {
  if (state.status != 'ok') { return state }
  
  try {
    await session.defaultSession.cookies.set(state.cookie)
  } catch(e) {
    state.status = "loginFailed"
    state.error = e
  }
  return state
}

export async function navigate (state) {
  if (state.status == 'ok') {
    await state.window.loadURL(state.url)
  } else {
    await state.window.loadURL(state.url + "/session/new")
  }
  return state
}

export async function showMainWindow (state) {
  state.window.show()
  return state
}

function parseCookies(headers) {
  return headers['set-cookie'][0]
  .split(/; */)
  .reduce((acc, c) => {
    const [ key, v ] = c.split('=', 2); 
    if (v) acc[key] = decodeURIComponent(v)
    else acc[key] = true

    return acc
  }, {})
}

export function mainWindow () {
  return BrowserWindow.getAllWindows()[0]
}