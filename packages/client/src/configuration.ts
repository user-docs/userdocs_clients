import {
  executeQuery, updater,
  getConfiguration as getConfigurationQuery,
  updateStepInstance as updateStepInstanceQuery,
  updateProcessInstance as updateProcessInstanceQuery,
  updateScreenshot as updateScreenshotQuery,
  createScreenshot as createScreenshotQuery
} from './query'

export const Configuration = {
  state: {},
  initialize: function() {
    this.state = {
      callbacks: {},
      auth: {}
    }
    return this
  },
  include: function(store) {
    this.state = {...this.state, ...store}
    return this
  },
  includeRunner: function(browserEventHandler) {
    this.state.automationFrameworkName = 'puppeteer'
    this.state.callbacks.broserEvent = browserEventHandler
    return this
  },
  includeServer: async function(client, headers) {
    const serverConfigurationResponse = await executeQuery(client, getConfigurationQuery, {}, headers)
    const serverConfiguration = serverConfigurationResponse.user.configuration
    this.state = {...this.state, ...serverConfiguration}
    return this
  },
  includeCallbacks: function(client, headers) {
    if(!client) throw new Error("Client not included in includeCallbacks call, cannot build callbacks")
    if(!headers) throw new Error("Headers not included in includeCallbacks call, cannot build callbacks")
    this.state.callbacks.updateStepInstance = updater(client, updateStepInstanceQuery, headers)
    this.state.callbacks.updateProcessInstance = updater(client, updateProcessInstanceQuery, headers)
    this.state.callbacks.updateScreenshot = updater(client, updateScreenshotQuery, headers)
    this.state.callbacks.createScreenshot = updater(client, createScreenshotQuery, headers)
    return this
  }
}