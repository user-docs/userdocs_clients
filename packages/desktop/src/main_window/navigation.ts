import { app, BrowserWindow } from 'electron'
const isDev = require('electron-is-dev');

var SESSION_URL
var APPLICATION_URL

if (isDev) {
  SESSION_URL = "https://dev.user-docs.com:4002'"
  SESSION_URL = APPLICATION_URL + "/session/new"
} else {
  APPLICATION_URL = "https://app.user-docs.com"
  SESSION_URL = APPLICATION_URL + "/session/new"
}

export async function navigateToLoginPage (mainWindow) {
  console.log("navigateToLoginPage")
  return mainWindow.loadURL(SESSION_URL)
}

export async function navigateToApplication (mainWindow) {
  console.log("navigateToApplication")
  return mainWindow.loadURL(APPLICATION_URL)
}

export async function authenticateJohnDavenport(mainWindow) {
  mainWindow = BrowserWindow.getAllWindows()[0]
  mainWindow.webContents.executeJavaScript("document.querySelector('#user_email').value = 'johns10davenport@gmail.com'")
  mainWindow.webContents.executeJavaScript("document.querySelector('#user_password').value = 'userdocs'")
  mainWindow.webContents.executeJavaScript("document.querySelector('button').click()")
  return mainWindow
}

export async function createMainWindow () {  
  app.commandLine.appendSwitch('ignore-certificate-errors');
  var win = await new BrowserWindow({
    width: 1600,
    height: 800,
    webPreferences: {
      preload: require('path').join(__dirname, './preload.js'),
      devTools: true,
      enableRemoteModule: false,
      webSecurity: false
    }
  })
  /*
  userdocs.mainWindow = win
  win.webContents.on('did-navigate', (event, input) => {
    console.log("Did Navigate")
    console.log(event.sender)
    console.log(event.sender.getTitle())
    console.log(event.sender.getType())
    console.log(event.sender.debugger)
    console.log(event.sender.inspectElement())
  })
  win.webContents.on('will-navigate', (event, input) => { console.log("Will Navigate") })
  win.webContents.on('will-redirect', (event, input) => { console.log("Will Redirect") })
  win.webContents.on('did-start-navigation', (event, input) => { console.log("did-start-navigation") })
  win.webContents.on('will-redirect', (event, input) => { console.log("will-redirect") })
  win.webContents.on('did-redirect-navigation', (event, input) => { console.log("did-redirect-navigation") })
  win.webContents.on('did-navigate', (event, input) => { console.log('did-navigate') })
  win.webContents.on('did-frame-navigate', (event, input) => { console.log('did-frame-navigate') })
  win.webContents.on('did-navigate-in-page', (event, input) => { console.log("did-navigate-in-page") })
  win.webContents.on('app-command', (event, input) => { console.log('app-command') })
  win.webContents.on('devtools-reload-page', (event, input) => {
    console.log('devtools-reload-page')
  })
  */
  return win
}

export function mainWindow () {
  return BrowserWindow.getAllWindows()[0]
}