import * as Runner from '@userdocs/runner'
import {Socket, Channel} from "phoenix-channels"
import {GraphQLClient} from 'graphql-request'
import {Configuration} from './configuration'
import {executeQuery, createStepInstance, createProcessInstance, createJobInstance} from './query'
import * as keytar from 'keytar';
const findChrome = require('chrome-finder');

interface Client {
  runner: Runner.Runner,
  socket: Socket,
  userChannel: Channel,
  graphQLClient: GraphQLClient,
  store: any
}

//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

async function authHeaders() {
  const accessToken = await keytar.getPassword('UserDocs', 'accessToken')
  return {authorization: accessToken}
}

let STATE

export async function create(store: any, app: string) {
  console.log("Creating Client")
  const token = await keytar.getPassword('UserDocs', 'accessToken')
  const userId = parseInt(await keytar.getPassword('UserDocs', 'userId'))
  const wsUrl = await store.get('wsUrl')
  const applicationUrl = await store.get('applicationUrl')
  
  const socket = new Socket(wsUrl, {params: {token: token}})
  const channel = socket.channel("user:" + userId, {app: app})

  const configuration = 
    Configuration
      .initialize()
      .includeRunner()
      .include(store.store)

  const client: Client = {
    runner: Runner.initialize(configuration.state),
    socket: socket,
    userChannel: channel,
    graphQLClient: new GraphQLClient(applicationUrl + "/api"),
    store: store
  }

  store = await initializeChromePath(store, client.runner, configuration.state)

  STATE = client
  return client
}

export async function connectSocket(client: Client) {
  await client.socket.connect()
  return client
} 

export async function disconnectSocket(client: Client) {
  clearInterval(client.socket.heartbeatTimer)
  await client.socket.disconnect(null, 1000, "Normal Disconnect")
  return client
}

export async function joinUserChannel(client: Client) { 
  client.userChannel.join()  
    .receive("error", resp => { throw new Error("Error while connecting to User Socket") })
    .receive("timeout", () => { throw new Error("Timeout while connecting to User Socket") })

  client.userChannel.on("command:open_browser", () => {openBrowser(client)})
  client.userChannel.on("command:close_browser", () => {closeBrowser(client)})
  client.userChannel.on("command:execute_step", (payload) => {executeStepInstance(client, payload.step_id)})
  client.userChannel.on("command:execute_process", (payload) => {executeProcess(client, payload.process_id)})
  client.userChannel.on("command:execute_job", (payload) => {executeJob(client, payload.job_id)})
  client.userChannel.on("command:get_configuration", (payload) => {getLocalConfiguration(client)})
  client.userChannel.on("command:put_configuration", (payload) => {putLocalConfiguration(client, payload)})
  client.userChannel.on("command:find_chrome", (payload) => {sendChromePath(client)})
  client.userChannel.on("command:navigate", (payload) => {navigate(client, payload)})
  client.userChannel.on("serviceStatus", (payload) => {console.log(payload)})

  while(client.userChannel.state != "joined") { await new Promise(resolve => setTimeout(resolve, 100)) }
  return client
}

export async function leaveUserChannel(client: Client) { 
  client.userChannel.leave()  
    .receive("error", resp => { throw new Error("Error while Leaving User Channel") })
    .receive("timeout", () => { throw new Error("Timeout while Leaving User Channel") })

  while(client.userChannel.state != "closed") { await new Promise(resolve => setTimeout(resolve, 100)) }
  
  return client
}

export async function openBrowser(client: Client) {
  const headers = await authHeaders()
  const token = await keytar.getPassword('UserDocs', 'accessToken')
  const userId = await keytar.getPassword('UserDocs', 'userId')
  const configuration =
    Configuration
      .initialize()
      .include(client.store.store)
      .include({token: token})
      .include({userId: userId})

  await configuration.includeServer(client, headers)

  try {
    client.runner = await Runner.openBrowser(client.runner, configuration.state)
    client.userChannel.push("event:browser_opened", {})
  } catch(e) {
    console.log(e)
  }
  client.runner.automationFramework.browser.on('disconnected', () => browserClosed(client))
  return client
}

export async function closeBrowser(client: Client) {
  client.runner = await Runner.closeBrowser(client.runner)
  client.userChannel.push("event:browser_closed", {})
  return client
}

export async function executeStepInstance(client: Client, stepId: number) {
  Runner.sendMessage(client.runner, {action: "START_RUNNING"})
  const headers = await authHeaders()
  const configuration = 
    Configuration
      .initialize()
      .include(client.store.store)
      .includeCallbacks(client, headers)

  await configuration.includeServer(client, headers)
      
  const variables = {stepId: stepId, status: "not_started"}
  const response = await executeQuery(client, createStepInstance, variables, headers)
  const stepInstance = response.createStepInstance
  const result = await Runner.executeStepInstance(stepInstance, client.runner, configuration.state)
  Runner.sendMessage(client.runner, {action: "STOP_RUNNING"})
  return result
}

export async function executeProcess(client: Client, processId: number) {
  Runner.sendMessage(client.runner, {action: "START_RUNNING"})
  const headers = await authHeaders()
  const configuration = 
    Configuration
      .initialize()
      .include(client.store.store)
      .includeCallbacks(client, headers)

  await configuration.includeServer(client, headers)

  const params = {processId: processId, status: "not_started"}
  const response = await client.graphQLClient.request(createProcessInstance, params, headers)
  const processInstance = response.createProcessInstance
  const result = await Runner.executeProcessInstance(processInstance, client.runner, configuration.state)
  Runner.sendMessage(client.runner, {action: "STOP_RUNNING"})
  return result
}

export async function executeJob(client: Client, jobId: number) {
  Runner.sendMessage(client.runner, {action: "START_RUNNING"})
  const headers = await authHeaders()
  const configuration = await
    Configuration
      .initialize()
      .include(client.store.store)
      .includeCallbacks(client, headers)

  await configuration.includeServer(client, headers)

  const params = {jobId: jobId, status: "not_started"}
  const response = await client.graphQLClient.request(createJobInstance, params, headers)
  const jobInstance = response.createJobInstance
  const result = await Runner.executeJobInstance(jobInstance, client.runner, configuration.state)
  Runner.sendMessage(client.runner, {action: "STOP_RUNNING"})
  return result
}

async function getLocalConfiguration(client: Client) {
  client.userChannel.push("event:configuration_fetched", client.store.store)
  return client
}

async function putLocalConfiguration(client: Client, payload) {
  client.store.set(payload)
  client.userChannel.push("event:configuration_saved", {})
  return client
}

function sendChromePath(client: Client) {
  try {
    const path = findChrome()
    client.userChannel.push("event:chrome_found", {path: path})
  } catch(e) {
    client.userChannel.push("event:chrome_not_found", {})
  }
}

function navigate(client: Client, payload) {
  Runner.sendMessage(client.runner, {action: "START_RUNNING"})
  console.log("Navigate Command")
  const configuration = Configuration.initialize().include(client.store.store)
  client.runner.automationFramework.navigate(client.runner, configuration, payload.url)
  Runner.sendMessage(client.runner, {action: "STOP_RUNNING"})
  return
}

async function initializeChromePath(store: any, runner: Runner.Runner, configuration: any) {  
  const chromePath = await runner.automationFramework.fetchBrowser(runner, configuration)
  const _logString = `Initialized chrome path to ${chromePath}`
  store.set('chromePath', chromePath)
  return store
}

function browserClosed(client: Client) { 
  client.userChannel.push("event:browser_closed", {})
}

export async function onSessionRefreshed(client: Client) {
  console.log("Client session refreshed")
  const token = await keytar.getPassword('UserDocs', 'accessToken')
  Runner.refreshSession(client.runner, {token: token})
}