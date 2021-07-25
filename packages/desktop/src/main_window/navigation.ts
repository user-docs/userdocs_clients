import { app, BrowserWindow } from 'electron'
const isDev = require('electron-is-dev');

var SESSION_URL
var APPLICATION_URL

if (isDev) {
  APPLICATION_URL = "https://app.user-docs.com"
  SESSION_URL = APPLICATION_URL + "/session/new"
} else {
  APPLICATION_URL = "https://app.user-docs.com"
  SESSION_URL = APPLICATION_URL + "/session/new"
}

export async function createMainWindow () {  
  app.commandLine.appendSwitch('ignore-certificate-errors');
  var win = await new BrowserWindow({
    width: 1600,
    height: 800,
    show: false,
    webPreferences: {
      preload: require('path').join(__dirname, './preload.js'),
      devTools: true
    }
  })
  return win
}

export async function getCredentials() {
  let email = ''
  let password = ''
  try {
    email = await keytar.getPassword('UserDocs', 'email')
    password = await keytar.getPassword('UserDocs', 'password')
  } catch(e) {
    email = null
    password = null
  }
  return {email: email, password: password}
}

export async function checkCredentials (mainWindow) {
  const credentials = await getCredentials()
  const email = credentials.email
  const password = credentials.password
  var navigateFunction
  var response

  if (email && password && email != '' && password != '') {
    try { 
      const tokens = await loginAPI(email, password, isDev) 
      response = await loginUI(tokens.access_token, isDev)
      navigateFunction = navigateToApplication
    }
    catch(e) { 
      navigateFunction = navigateToLoginPage
    }
  }
  await navigateFunction(mainWindow, response.headers)
  return mainWindow
}

export async function navigateToLoginPage (mainWindow) {
  return mainWindow.loadFile('./gui/login.html')
}
  })

function parseCookies(headers) {
  return headers['set-cookie'][0]
  .split(/; */)
  .reduce((acc, c) => {
    console.log(acc)
    console.log(c)
    const [ key, v ] = c.split('=', 2); 
    if (v) acc[key] = decodeURIComponent(v)
    else acc[key] = true

    return acc
  }, {})
}

export async function navigateToApplication (mainWindow, headers) {
  let url

  if(isDev) url = "https://dev.user-docs.com:4002"
  else url = "https://app.user-docs.com"

  if (headers) {
    const cookie = parseCookies(headers)
    cookie.url = url
    cookie.name = '_userdocs_web_key'
    cookie.value = cookie._userdocs_web_key
    delete cookie._userdocs_web_key
    await session.defaultSession.cookies.set(cookie)
  }

  return mainWindow.loadURL(APPLICATION_URL)
}
export function mainWindow () {
  return BrowserWindow.getAllWindows()[0]
}