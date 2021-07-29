import { create, start, stop, initializeClient, initializeServer, getConfiguration } from '@userdocs/server'
import * as Runner from '@userdocs/runner'
import { app, ipcMain } from 'electron';
import { 
  mainWindow, 
  createMainWindow,
  getStoredCredentials,
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

const stepUpdated = function(step) { 
  mainWindow().webContents.send('stepStatusUpdated', step); 
  return step 
}

const processUpdated = function(process) { 
  mainWindow().webContents.send('processUpdated', process); 
  return process 
}

const browserEventHandler = function(event) {
  console.log('browserEventHandler')
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
    email: null, password: null, token: null, 
    window: null, url: APPLICATION_URL, cookie: null,
    error: null
  }

  initialize(state)
}

async function initialize(state) {
  var server
  
  state = await createMainWindow(state)
  state = await getStoredCredentials(state)
  state = await getTokens(state)
  state = await getSession(state)
  state = await putSession(state)
  state = await navigate(state)
  state = await showMainWindow(state)

  server = await create({store: store, port: PORT, tokens: (state as any).tokens, url: (state as any).url})
  server = initializeClient(server)
  const result = await getConfiguration(server)
  server = initializeServer(server)
  server = await start(server)

  if (result.user.configuration.css) store.set('css', result.user.configuration.css)
  if (result.user.configuration.strategy) store.set('strategy', result.user.configuration.strategy)

  server = initializeServer(server)
  userdocs.server = server
  userdocs.runner = Runner.initialize(userdocs.configuration)
}

ipcMain.on('openBrowser', async (event) => { 
  if(!userdocs.runner.automationFramework.browser) userdocs.runner = await openBrowser()
  return true
 })

async function openBrowser() {
  if(!userdocs.runner) throw ("No RUnner")
  userdocs.runner = await Runner.openBrowser(userdocs.runner)
  userdocs.runner.automationFramework.browser.on('disconnected', () => browserClosed(null))
  mainWindow().webContents.send('browserOpened', { sessionId: 'id' })
  return userdocs.runner
}

ipcMain.on('closeBrowser', async (event) => { 
  if(!userdocs.runner) throw ("No RUnner")
  userdocs.runner = await Runner.closeBrowser(userdocs.runner, userdocs.configuration)
  browserClosed('id')
  return true
})

function browserClosed(id) { 
  const browserId = id ? id : null
  mainWindow().webContents.send('browserClosed', browserId)
}

ipcMain.handle('login', async (event, credentials) => {
	try {
    const apiResponse = await loginAPI(credentials.email, credentials.password, isDev)
    await loginUI(apiResponse.access_token, isDev)
    keytar.setPassword('UserDocs', 'email', credentials.email)
    keytar.setPassword('UserDocs', 'password', credentials.password)
    keytar.setPassword('UserDocs', 'renewal_token', apiResponse.data.renewal_token)
    return true
	} catch (error) {
    console.log("Login failed")
    return false
	}
})

ipcMain.on('execute', async (event, step) => {
  if(!userdocs.runner) throw ("No RUnner")
  if(!userdocs.runner.automationFramework.browser) userdocs.runner = await openBrowser()
  await Runner.executeStep(step, userdocs.runner)
})

ipcMain.on('executeProcess', async (event, process) => {
  if(!userdocs.runner.automationFramework.browser) await openBrowser()
  await Runner.executeProcess(process, userdocs.runner)
})

ipcMain.on('executeJob', async (event, job) => {
  if(!userdocs.runner.automationFramework.browser) userdocs.runner = await openBrowser()
  await Runner.executeJob(job, userdocs.runner)
})

ipcMain.on('start', (event) => {
  userdocs.runState = 'running'
})

ipcMain.on('configure', async (event, message) => {
  if (message.image_path) {
    store.set('imagePath', message.image_path)
    userdocs.configuration.imagePath = message.image_path
  }
  if (message.user_data_dir_path) {
    store.set('userDataDirPath', message.user_data_dir_path)
    userdocs.configuration.userDataDirPath = message.user_data_dir_path
  }
  if (message.css) {
    store.set('css', message.css)
    userdocs.configuration.css = message.css
  }
  if (message.overrides) {
    store.set('overrides', message.overrides)
    userdocs.configuration.overrides = message.overrides
  }
  if (message.strategy) userdocs.configuration.strategy = message.strategy
  try {
    userdocs.runner = Runner.reconfigure(userdocs.runner, userdocs.configuration)
  } catch(e) {
    userdocs.runner = Runner.initialize(userdocs.configuration)
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
  stop(server)
  await Runner.closeBrowser(userdocs.runner, userdocs.configuration)
})