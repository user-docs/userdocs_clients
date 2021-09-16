import { app, BrowserWindow, session } from 'electron'
import { validateTokens, loginUI } from './login'
import * as keytar from 'keytar';

const isDev = require('electron-is-dev');

export async function createMainWindow (state) {  
  if (isDev) {
    app.commandLine.appendSwitch('ignore-certificate-errors');
  }
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
    state.tokens.user_id = await keytar.getPassword('UserDocs', 'userId')
  } catch (e) {
    state.status = "tokenFetchFailed"
    state.error = e
  }
  return state
}

export async function validate (state) {
  if (state.status != 'ok') { return state }
  console.debug("validate")

  const status = await validateTokens(state.url, state.tokens)
  if (status.status === "update") state.tokens = status.tokens
  else if (status.status === "ok") await keytar.setPassword('UserDocs', 'userId', status.user.id)
  return state
}

export async function getSession(state) {
  if (state.status != 'ok') { return state }

  var response
  try {
    response = await loginUI(state.tokens.access_token, state.url)
    var cookie = parseCookies(response.headers)
  } catch(e) {
    state.status = "loginFailed"
    state.error = e
    return state
  }
  const userId = response.data.user_id
  await keytar.setPassword('UserDocs', 'userId', userId.toString())
  cookie.url = state.url
  cookie.name = '_userdocs_web_key'
  cookie.value = cookie._userdocs_web_key
  delete cookie._userdocs_web_key
  state.cookie = cookie
  state.userId = userId
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