const { ipcRenderer, contextBridge } = require('electron')
const { browserOpened, browserClosed, stepUpdated, processUpdated, browserEventHandler } = require('./events.js')


contextBridge.exposeInMainWorld('userdocs', {
  test: () => { console.log('test')},
  configure: (configuration) => { ipcRenderer.send('configure', configuration) },
  //openBrowser: () => { ipcRenderer.send('openBrowser') },
  openBrowser: () => { ipcRenderer.send('openBrowser') },
  closeBrowser: () => { ipcRenderer.send('closeBrowser') },
  execute: (step_instance) => { ipcRenderer.send('execute', step_instance) },
  executeProcess: (process) => { ipcRenderer.send('executeProcess', process) },
  executeJob: (job) => { ipcRenderer.send('executeJob', job)},
  start: () => { ipcRenderer.send('start')},
  testSelector: (message) => { ipcRenderer.send('testSelector', message)},
  login: (credentials) => { return ipcRenderer.invoke('login', credentials) }
})

ipcRenderer.on('browserOpened', (event, payload) => browserOpened(payload))
ipcRenderer.on('browserClosed', (event, payload) => browserClosed(payload))
ipcRenderer.on('stepStatusUpdated', (event, payload) => { stepUpdated(payload) }) 
ipcRenderer.on('processUpdated', (event, payload) => processUpdated(payload))
ipcRenderer.on('browserEvent', (event, payload) => browserEventHandler(payload))