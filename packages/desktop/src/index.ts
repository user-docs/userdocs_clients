import { app, ipcMain } from 'electron';
import { 
  mainWindow, 
  navigateToLoginPage, 
  authenticateJohnDavenport, 
  createMainWindow } from './main_window/navigation'
import * as Runner from '@userdocs/runner'
import { configSchema } from './configSchema'
import { autoUpdater } from 'electron-updater'
import * as fs from 'fs';

const path = require('path')
const isDev = require('electron-is-dev');
const Store = require('electron-store');

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../', 'node_modules', '.bin', 'electron')
  });
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
  if(isDev) {
    userdocs.configuration.environment = 'development'
    createMainWindow()
      .then( mainWindow => navigateToLoginPage(mainWindow) )
      .then( mainWindow => authenticateJohnDavenport(mainWindow))
      .catch( e => console.log(e))
  } else {
    createMainWindow()
      .then( mainWindow => navigateToLoginPage(mainWindow) )
      .catch( e => console.log(e))
  }
  const appPath = app.getPath("appData")
  const name = app.getName()
  const defaultImagePath = path.join(appPath, name, "images")
  const defaultDataDirPath = path.join(appPath, name, "chromeDataDir")

  if (!fs.existsSync(defaultImagePath)) fs.mkdirSync(defaultImagePath)
  if (!fs.existsSync(defaultDataDirPath)) fs.mkdirSync(defaultDataDirPath)

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
})

/*
ipcMain.on('testSelector', async (event, message) => {
  automationModule = puppeteer
  automationModule.testSelector(userdocs.browser, message)
  console.log("Maybe I need to push some stuff in here")
})
*/
app.whenReady().then(main)

app.on("ready", () => {
	autoUpdater.checkForUpdatesAndNotify()
});

app.on("before-quit", async () => {
  await Runner.closeBrowser(userdocs.runner, userdocs.configuration)
})