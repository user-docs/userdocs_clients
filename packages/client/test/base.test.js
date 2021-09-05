const axios = require('axios')
const client = require('../src/index')
const {Channel, Socket} = require('phoenix-channels')
const WebSocket = require('websocket').w3cwebsocket
const Store = require('electron-store');
const keytar = require('keytar')
const schema = {
  userId: {type: 'number', default: 1}, 
  imagePath: {type: 'string', default: ''},
  userDataDirPath: {type: 'string', default: ''}
}

const APP_URL = "https://dev.user-docs.com:4002"

const store = new Store(schema)
store.set('imagePath', '/home/johns10/Applications/UserDocs/images')
store.set('userDataDirPath', '/home/johns10/Applications/UserDocs/user_data_dir')
store.set('wsUrl', 'ws://localhost:4000/socket')
store.set('environment', 'development')
store.set('browserTimeout', 5000)
store.set('maxRetries', 3)
store.set('chromePath', '')

jest.setTimeout(20000)

var STATE
var DATA = {user: {id: 1, email: 'johns10davenport@gmail.com', password: 'userdocs'}}


async function login(email) {
  const sessionUrl = APP_URL + "/api/session"
	const authParams = {'user[email]': email, 'user[password]': 'userdocs'}
  result = await axios.post(sessionUrl, null, { params: authParams })
  return result
}

async function checkout() {
  const checkoutUrl = APP_URL + "/integration/db/checkout"
  return axios.post(checkoutUrl)
}

async function checkin() {
  const checkinUrl = APP_URL + "/integration/db/checkin"
  return axios.post(checkinUrl)
}

async function factory() {
  const factoryUrl = APP_URL + "/integration/db/factory"
  return axios.post(factoryUrl)
}

beforeAll( async () => { 
  await checkout()
  DATA = (await factory()).data
  const tokens = (await login(DATA.user.email)).data.data
  await keytar.setPassword('UserDocs', 'accessToken', tokens.access_token)
  await keytar.setPassword('UserDocs', 'renewalToken', tokens.renewal_token)
  await keytar.setPassword('UserDocs', 'userId', tokens.user_id.toString())
})
afterAll( async () => { 
  await checkin()
  delete STATE
})

test('creates a client', async () => {
  STATE = await client.create(store, "test")
  expect(STATE.socket).toBeInstanceOf(Socket)
  expect(STATE.userChannel).toBeInstanceOf(Channel)
  expect(STATE.userChannel.state).toStrictEqual('closed')
})

test('connects the socket', async () => {
  STATE = await client.connectSocket(STATE)
  expect(STATE.socket.conn).toBeInstanceOf(WebSocket)
})

test('connects the userChannel', async () => {
  STATE = await client.joinUserChannel(STATE)
  expect(STATE.userChannel.state).toStrictEqual('joined')
})

test('opens the browser', async() => {
  await client.openBrowser(STATE)
  await new Promise(resolve => setTimeout(resolve, 1000))
  expect(STATE.runner.automationFramework.browser.constructor.name).toStrictEqual('Browser')
})

test('fails a step', async() => {
  result = await client.executeStepInstance(STATE, DATA.failing_step.id)
  expect(result).toStrictEqual(
    expect.objectContaining({
      status: "failed"
    })
  )
})

test('creates a screenshot', async() => {
  console.log(DATA.full_screen_screenshot_step.id)
  result = await client.executeStepInstance(STATE, DATA.full_screen_screenshot_step.id)
  expect(result).toStrictEqual(
    expect.objectContaining({
      status: "complete"
    })
  )
})

test('updates a screenshot', async() => {
  result = await client.executeStepInstance(STATE, DATA.full_screen_screenshot_step.id)
  expect(result).toStrictEqual(
    expect.objectContaining({
      status: "complete"
    })
  )
})

test('executes a step', async() => {
  result = await client.executeStepInstance(STATE, DATA.step.id)
  expect(result).toStrictEqual(
    expect.objectContaining({
      status: "complete"
    })
  )
})

test('executes a process', async() => {
  result = await client.executeProcess(STATE, DATA.process.id)
  expect(result).toStrictEqual(
    expect.objectContaining({
      status: "complete"
    })
  )
})


test('fails a process', async() => {
  result = await client.executeProcess(STATE, DATA.failing_process.id)
  expect(result).toStrictEqual(
    expect.objectContaining({
      status: "failed"
    })
  )
})

test('runs a job', async() => {
  await client.executeJob(STATE, DATA.job.id)
})



test('closes the browser', async() => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  await client.closeBrowser(STATE)
})

test('leaves the channel', async() => {
  STATE = await client.leaveUserChannel(STATE)
  expect(STATE.userChannel.state).toStrictEqual("closed")
})

test('disconnects the socket', async() => {
  STATE = await client.disconnectSocket(STATE)
  expect(STATE.socket.conn).toBeNull
})
