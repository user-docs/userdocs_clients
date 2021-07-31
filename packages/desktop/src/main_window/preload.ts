const { ipcRenderer, contextBridge } = require('electron')
const { browserOpened, browserClosed, stepUpdated, processUpdated, browserEventHandler } = require('./events.js')

interface Window {electronRequire: any}
var testMode = false
if (process.env.NODE_ENV === 'test') {
  window.electronRequire = eval('require');
  testMode = true
}

const api = {
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
  login: async (credentials) => { 
    const result = await ipcRenderer.invoke('login', credentials) 
    if (result) ipcRenderer.send('startServices')
  },
  port: () => { return ipcRenderer.invoke('port') }
}

if (!testMode) {
  contextBridge.exposeInMainWorld('userdocs', api)
} else {
  /**
   * Recursively Object.freeze() on objects and functions
   * @see https://github.com/substack/deep-freeze
   * @param o Object on which to lock the attributes
   */
  function deepFreeze<T extends Record<string, any>>(o: T): Readonly<T> {
    Object.freeze(o)

    Object.getOwnPropertyNames(o).forEach(prop => {
      if (o.hasOwnProperty(prop)
        && o[prop] !== null
        && (typeof o[prop] === 'object' || typeof o[prop] === 'function')
        && !Object.isFrozen(o[prop])) {
        deepFreeze(o[prop])
      }
    })

    return o
  }

  deepFreeze(api)

  // ts-expect-error https://github.com/electron-userland/spectron#node-integration
  window.electronRequire = eval('require');

  // @ts-expect-error https://github.com/electron-userland/spectron/issues/693#issuecomment-747872160
  window.electron = api
}

ipcRenderer.on('browserOpened', (event, payload) => browserOpened(payload))
ipcRenderer.on('browserClosed', (event, payload) => browserClosed(payload))
ipcRenderer.on('stepStatusUpdated', (event, payload) => { stepUpdated(payload) }) 
ipcRenderer.on('processUpdated', (event, payload) => processUpdated(payload))
ipcRenderer.on('browserEvent', (event, payload) => browserEventHandler(payload))