import { create, start, stop, initializeClient, initializeServer, getConfiguration } from '@userdocs/server'
import * as Runner from '@userdocs/runner'
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

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const path = require('path')
const isDev = require('electron-is-dev');
const Store = require('electron-store');
const PORT = Math.floor(Math.random() * (65535 - 49152) + 49152);

var APPLICATION_URL

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
  APPLICATION_URL = "https://dev.user-docs.com:4002"
} else {
  APPLICATION_URL = "https://app.user-docs.com"
}

const store = new Store(configSchema)
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

const userdocs = {
  browser: null,
  browserExecutionQueue: [],
  process: {},
  runState: 'stopped',
  runner: null,
  server: null,
  configuration: {
    automationFrameworkName: store.get('automationFrameworkName', 'puppeteer'),
    maxRetries: store.get('maxRetries', 10),
    maxWaitTime: store.get('maxWaitTime', 10),
    environment: store.get('environment', 'desktop'),
    imagePath: store.get('imagePath', ''),
    css: store.get('css', ''),
    overrides: store.get('overrides', ''),
    userDataDirPath: store.get('userDataDirPath', ''),
    strategy: "xpath",
    appDataDir: app.getPath("appData"),
    appPath: app.getAppPath(),
    callbacks: {
      step: {
        preExecutionCallbacks: [ 'startLastStepInstance', stepUpdated ],
        executionCallback: 'run',
        successCallbacks: [ 'completeLastStepInstance', stepUpdated ],
        failureCallbacks: [ 'failLastStepInstance', stepUpdated ]
      },
      process: {
        preExecutionCallbacks: [ 'startLastProcessInstance', processUpdated ],
        executionCallback: 'run',
        successCallbacks: [ 'completeLastProcessInstance', processUpdated ],
        failureCallbacks: [ 'failProcessInstance', processUpdated ]
      },
      job: {
        preExecutionCallbacks: [ 'startLastJobInstance' ],
        executionCallback: 'run',
        successCallbacks: [ 'completeLastJobInstance' ],
        failureCallbacks: [ 'failLastJobInstance' ]
      },
      browserEvent: browserEventHandler
    }
  }
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
    console.log("Sending status")
    console.log(result)
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
  const accessToken = await keytar.getPassword('UserDocs', 'accessToken')
  const renewalToken = await keytar.getPassword('UserDocs', 'renewalToken')
  const tokens = {renewal_token: renewalToken, access_token: accessToken}
  var server = await create({store: store, port: PORT, tokens: tokens, url: APPLICATION_URL})
  server = initializeClient(server)
  const result = await getConfiguration(server)
  server = initializeServer(server)
  server = await start(server)

  if (result.user.configuration.css) store.set('css', result.user.configuration.css)
  if (result.user.configuration.strategy) store.set('strategy', result.user.configuration.strategy)

  server = initializeServer(server)
  userdocs.server = server
  userdocs.runner = Runner.initialize(userdocs.configuration)

  return serviceStatus()
}

ipcMain.handle('serviceStatus', serviceStatus)
function serviceStatus() {
  var status = {server: null, client: null, runner: null}
  if (userdocs.server == null) {
    status.server = "not_running"
    status.client = "not_running"
  }
  else if (userdocs.server) {
    if (userdocs.server.server.state) status.server = userdocs.server.server.state.phase
    if (userdocs.server.client == null) status.client = "not_running"
    else if (userdocs.server.client) status.client = "running"
  }

  if (userdocs.runner == null) status.runner = "not_running"
  else if (userdocs.runner) status.runner = "running"

  return status
}

ipcMain.on('openBrowser', async (event) => { 
  if(!userdocs.runner.automationFramework.browser) userdocs.runner = await openBrowser()
  return true
 })

async function openBrowser() {
  if(!userdocs.runner) throw ("No RUnner")
  configure()
  userdocs.runner = await Runner.openBrowser(userdocs.runner)
  userdocs.runner.automationFramework.browser.on('disconnected', () => browserClosed(null))
  mainWindow().webContents.send('browserOpened', { sessionId: 'id' })
  return userdocs.runner
}

ipcMain.on('closeBrowser', async (event) => { 
  if(!userdocs.runner) throw ("No RUnner")
  configure()
  userdocs.runner = await Runner.closeBrowser(userdocs.runner, userdocs.configuration)
  browserClosed('id')
  return true
})

function browserClosed(id) { 
  const browserId = id ? id : null
  mainWindow().webContents.send('browserClosed', browserId)
}

ipcMain.on('execute', async (event, step) => {
  if(!userdocs.runner) throw ("No RUnner")
  configure()
  if(!userdocs.runner.automationFramework.browser) userdocs.runner = await openBrowser()
  await Runner.executeStep(step, userdocs.runner)
})

ipcMain.on('executeProcess', async (event, process) => {
  configure()
  if(!userdocs.runner.automationFramework.browser) await openBrowser()
  await Runner.executeProcess(process, userdocs.runner)
})

ipcMain.on('executeJob', async (event, job) => {
  configure()
  if(!userdocs.runner.automationFramework.browser) userdocs.runner = await openBrowser()
  await Runner.executeJob(job, userdocs.runner)
})

function configure () {
  userdocs.configuration.imagePath = store.get('imagePath')
  userdocs.configuration.userDataDirPath = store.get('userDataDirPath')
  userdocs.configuration.css = store.get('css')
  userdocs.configuration.overrides = store.get('overrides')
  userdocs.configuration.strategy = store.get('strategy')
  
  try {
    userdocs.runner = Runner.reconfigure(userdocs.runner, userdocs.configuration)
  } catch(e) {
    userdocs.runner = Runner.initialize(userdocs.configuration)
  } 
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
  try {
    await keytar.setPassword('UserDocs', 'accessToken', tokens.access_token)
    await keytar.setPassword('UserDocs', 'renewalToken', tokens.renewal_token)
    return {status: "ok"}
  } catch(e) {
    return {status: "nok", error: e}
  }
}

ipcMain.on('start', (event) => {
  userdocs.runState = 'running'
})

ipcMain.handle('port', async() => { return PORT })

app.whenReady().then(main)

app.on("ready", () => {
	autoUpdater.checkForUpdatesAndNotify()
});

app.on("before-quit", async () => {
  stop(userdocs.server)
  await Runner.closeBrowser(userdocs.runner, userdocs.configuration)
})