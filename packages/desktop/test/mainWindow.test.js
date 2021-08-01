const Application = require('spectron').Application
const electronPath = require('electron')
const path = require('path')

appPath = path.join(__dirname, '..', 'build', 'index.js')

const app = new Application({
  path: electronPath,
  args: [appPath],
  chromeDriverLogPath: "/home/johns10/cd.log",
  connectionRetryCount: 1,
  port: 1595
})

const optimalStatusReport = {client: 'running', runner: 'running', server: 'initialized with schema'}

jest.setTimeout(10000)

describe("Spectron", () => {
  beforeEach(async function () {
    await app.start()
  })
  afterEach(async function () {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })
  
  test("should launch app", async () => {
    const windowCount = await app.client.getWindowCount()
    expect(windowCount).toStrictEqual(1)
  });

  test("login in with a fresh store starts services", async () => {
    app.client.execute('window.userdocs.clearCredentials()')
    initialResult = await app.client.execute('return window.userdocs.serviceStatus()')
    expect(initialResult).toStrictEqual({client: 'not_running', runner: 'not_running', server: 'not_running'})
    loginElement = await app.client.$("#signin-form_email")
    await loginElement.setValue("johns10davenport@gmail.com")
    passwordElement = await app.client.$("#signin-form_password")
    await passwordElement.setValue("userdocs")
    submitElement = await app.client.$("button")
    await submitElement.click()
    await app.client.waitUntil(
      async () => (await (await app.client.$("p.title")).getText()) === "Welcome to UserDocs!"
    )
    await app.client.waitUntil(
      async () => (await (await app.client.$("#client-status")).getAttribute("data-status")) === "ok"
    )
    afterLoginResult = await app.client.execute('return window.userdocs.serviceStatus()')
    expect(afterLoginResult).toStrictEqual(optimalStatusReport)
  });
  
  test("login with a hydrated store starts services", async() => {
    await app.client.waitUntil(
      async () => (await (await app.client.$("p.title")).getText()) === "Welcome to UserDocs!"
    )
    await app.client.waitUntil(
      async () => (await (await app.client.$("#client-status")).getAttribute("data-status")) === "ok"
    )
    serviceStatus = await app.client.execute('return window.userdocs.serviceStatus()')
    expect(serviceStatus).toStrictEqual(optimalStatusReport)
  })
  
  test("logout returns to login screen", async() => {
    signoutElement = await app.client.$("#signout-button")
    await signoutElement.click()
    await app.client.waitUntil(
      async () => (await (await app.client.$("p.title")).getText()) === "Welcome to UserDocs!"
    )
    await app.client.waitUntil(
      async () => (await (await app.client.$("#client-status")).getAttribute("data-status")) === "ok"
    )
    serviceStatus = await app.client.execute('return window.userdocs.serviceStatus()')
    expect(serviceStatus).toStrictEqual(optimalStatusReport)
  })
});