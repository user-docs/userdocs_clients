import * as Client from '@userdocs/client'
import { app, ipcMain } from 'electron';
import { 
  mainWindow, 
  createMainWindow,
  getTokens,
  getSession,
  putSession,
  navigate,
  showMainWindow 
} from './main_window/navigation'
import { configSchema } from './configSchema'
import { autoUpdater } from 'electron-updater'
import * as fs from 'fs';
import { loginAPI, loginUI } from './main_window/login'
import * as keytar from 'keytar';

//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const path = require('path')
const isDev = require('electron-is-dev');
const Store = require('electron-store');

const store = new Store(configSchema)

var APPLICATION_URL
var WS_URL

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
  store.set('environment', 'desktop')
  APPLICATION_URL = "https://app.user-docs.com"
  WS_URL = "https://app.user-docs.com/socket"
} else {
  store.set('environment', 'desktop')
  APPLICATION_URL = "https://app.user-docs.com"
  WS_URL = "https://app.user-docs.com/socket"
}

store.set('applicationUrl', APPLICATION_URL)

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
  state = await getSession(state)
  state = await putSession(state)
  state = await navigate(state)
  state = await showMainWindow(state)
  return state
}

ipcMain.handle('startServices', startServices)
async function startServices() {
  console.log("Starting Services")
  const accessToken = await keytar.getPassword('UserDocs', 'accessToken')
  const renewalToken = await keytar.getPassword('UserDocs', 'renewalToken')
  const userId = parseInt(await keytar.getPassword('UserDocs', 'userId'))
  const tokens = {renewal_token: renewalToken, access_token: accessToken}
  var client = Client.create(accessToken, userId, WS_URL, APPLICATION_URL, "electron", store, app.getAppPath(), app.getPath("appData"), )
  client = await Client.connectSocket(client)
  client = await Client.joinUserChannel(client)
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
    await store.set('userId', tokens.user_id.toString())
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
