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
      show: false,
      webPreferences: {
        preload: require('path').join(__dirname, './preload.js'),
        devTools: true
      }
    })
  } catch(e) {
    state.error = e
  }
  return state
}

export async function getStoredCredentials(state) {
  if (!state.window) { throw new Error("getStoredCredentials called with no window") }
  if (state.error) { return state }

  try {
    state.email = await keytar.getPassword('UserDocs', 'email')
    state.password = await keytar.getPassword('UserDocs', 'password')
  } catch(e) {
    state.error = e
  }
  return state
}

export async function getTokens (state) {
  if (!state.email || !state.password) { throw new Error("checkCredentials called with no email or password") }
  if (state.email == '' || state.password == '') { throw new Error("checkCredentials called with blank email or password") }
  if (state.error) { return state }

  try {
    state.tokens = await loginAPI(state.email, state.password, state.url) 
  } catch (e) {
    state.error = e
  }
  return state
}

export async function getSession(state) {
  if (!state.tokens) { throw new Error("getSession called with no tokens") }
  if (state.error) { return state }

  try {
    const response = await loginUI(state.tokens.access_token, state.url)
    var cookie = parseCookies(response.headers)
    cookie.url = state.url
    cookie.name = '_userdocs_web_key'
    cookie.value = cookie._userdocs_web_key
    delete cookie._userdocs_web_key
    state.cookie = cookie
  } catch(e) {
    state.error = e
  }
  return state
}

export async function putSession(state) {
  if (!state.cookie) { throw new Error("putSession called with no cookie") }
  if (state.error) { return state }
  
  try {
    await session.defaultSession.cookies.set(state.cookie)
  } catch(e) {
    state.error = e
  }
  return state
}

export async function navigate (state) {
  if (state.cookie.value) {
    await state.window.loadURL(state.url)
  } else {
    await state.window.loadFile('./gui/login.html')
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