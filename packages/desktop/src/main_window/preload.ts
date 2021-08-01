const { ipcRenderer, contextBridge } = require('electron')
const { serviceStatus, browserOpened, browserClosed, stepUpdated, processUpdated, browserEventHandler, clearCredentials } = require('./events.js')

interface Window {electronRequire: any}
var testMode = false
if (process.env.NODE_ENV === 'test') {testMode = true}

const api = {
  test: () => { console.log('test')},
  //configure: (configuration) => { ipcRenderer.send('configure', configuration) },
  openBrowser: () => { ipcRenderer.send('openBrowser') },
  closeBrowser: () => { ipcRenderer.send('closeBrowser') },
  execute: (step_instance) => { ipcRenderer.send('execute', step_instance) },
  executeProcess: (process) => { ipcRenderer.send('executeProcess', process) },
  executeJob: (job) => { ipcRenderer.send('executeJob', job)},
  start: () => { ipcRenderer.send('start')},
  port: () => { return ipcRenderer.invoke('port') },

  clearCredentials: () => { ipcRenderer.send('clearCredentials')},
  putTokens: async(tokens) => {return await ipcRenderer.invoke('putTokens', tokens)},
  startServices: async() => {return ipcRenderer.invoke('startServices')},
  serviceStatus: async() => {return ipcRenderer.invoke('serviceStatus')}
}

contextBridge.exposeInMainWorld('userdocs', api)

ipcRenderer.on('serviceStatus', (event, payload) => serviceStatus(payload))
ipcRenderer.on('browserClosed', (event, payload) => browserClosed(payload))
ipcRenderer.on('stepStatusUpdated', (event, payload) => { stepUpdated(payload) }) 
ipcRenderer.on('processUpdated', (event, payload) => processUpdated(payload))
ipcRenderer.on('browserEvent', (event, payload) => browserEventHandler(payload))