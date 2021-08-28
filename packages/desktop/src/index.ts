import * as Client from '@userdocs/client'
import { app, ipcMain } from 'electron';
import { 
  mainWindow, 
  createMainWindow,
  getTokens,
  validate,
  getSession,
  putSession,
  startTokenRefresh,
  navigate,
  showMainWindow 
} from './main_window/navigation'
import { configSchema } from './configSchema'
import { autoUpdater } from 'electron-updater'
import * as fs from 'fs';
import * as keytar from 'keytar';

const path = require('path')
const isDev = require('electron-is-dev');
const Store = require('electron-store');

const store = new Store(configSchema)

var APPLICATION_URL
var WS_URL
var ENVIRONMENT
var STATE = {
  client: null
}

if (isDev) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
  /*
  ENVIRONMENT = "development"
  APPLICATION_URL = "https://app.user-docs.com"
  WS_URL = "wss://app.user-docs.com/socket"
  */
  ENVIRONMENT = "development"
  APPLICATION_URL = "https://dev.user-docs.com:4002"
  WS_URL = "ws://localhost:4000/socket"
} else {
  ENVIRONMENT = "desktop"
  APPLICATION_URL = "https://app.user-docs.com"
  WS_URL = "wss://app.user-docs.com/socket"
}


store.set('environment', ENVIRONMENT)
store.set('wsUrl', WS_URL)
store.set('applicationUrl', APPLICATION_URL)

/* Might do this again someday
const stepUpdated = function(step) { 
  mainWindow().webContents.send('stepStatusUpdated', step); 
  return step 
}

const processUpdated = function(process) { 
  mainWindow().webContents.send('processUpdated', process); 
  return process 
}

const browserEventHandler = function(event) {
  mainWindow().webContents.send('browserEvent', event);
}
*/

function main() {
  const appPath = app.getPath("appData")
  const name = app.getName()
  const defaultImagePath = path.join(appPath, name, "images")
  const defaultDataDirPath = path.join(appPath, name, "chromeDataDir")

  if (!fs.existsSync(defaultImagePath)) fs.mkdirSync(defaultImagePath)
  if (!fs.existsSync(defaultDataDirPath)) fs.mkdirSync(defaultDataDirPath)

  var state = {
    tokens: {}, window: null, 
    url: APPLICATION_URL, cookie: null, error: null, status: 'ok'
  }

  initialize(state)
}

async function initialize(state) {
  state = await initializeWindow(state)
  if (state.status == "ok") {
    const result = await startServices()
    mainWindow().webContents.send('serviceStatus', result)
  }
}

async function initializeWindow(state) {
  state = await createMainWindow(state)
  state = await getTokens(state)
  state = await validate(state)
  state = await getSession(state)
  state = await putSession(state)
  state = await startTokenRefresh(state)
  state = await navigate(state)
  state = await showMainWindow(state)
  return state
}

ipcMain.handle('startServices', startServices)
async function startServices() {
  console.log("Starting Services")
  const environment = await store.get('environment')
  store.set('appPath', app.getAppPath())
  store.set('appDataPath', app.getPath("appData"))
  if (STATE.client === null) STATE.client = await Client.create(store, "electron")
  if (STATE.client.socket.connectionState() != "open") STATE.client = await Client.connectSocket(STATE.client)
  if (STATE.client.userChannel.state != "joined") STATE.client = await Client.joinUserChannel(STATE.client)
}


ipcMain.on('clearCredentials', async () => {clearCredentials()})
async function clearCredentials() {
  await keytar.deletePassword('UserDocs', 'email')
  await keytar.deletePassword('UserDocs', 'password')
  await keytar.deletePassword('UserDocs', 'accessToken')
  await keytar.deletePassword('UserDocs', 'renewalToken')
}

ipcMain.handle('putTokens', putTokens)
async function putTokens(event, tokens) {
  if(!tokens.access_token) throw new Error("No access token found")
  if(!tokens.renewal_token) throw new Error("No renewal token found")
  if(!tokens.user_id) throw new Error("No renewal token found")
  try {
    await keytar.setPassword('UserDocs', 'accessToken', tokens.access_token)
    await keytar.setPassword('UserDocs', 'renewalToken', tokens.renewal_token)
    await keytar.setPassword('UserDocs', 'userId', tokens.user_id.toString())
    return {status: "ok"}
  } catch(e) {
    return {status: "nok", error: e}
  }
}

app.whenReady().then(main)

app.on("ready", () => {
	autoUpdater.checkForUpdatesAndNotify()
});

app.on("before-quit", async () => {
  //await Runner.closeBrowser(userdocs.runner)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', (reason as any).stack);
  // application specific logging, throwing an error, or other logic here
});
