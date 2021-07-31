const Application = require('spectron').Application
const electronPath = require('electron')
const path = require('path')

appPath = path.join(__dirname, '..', 'build', 'index.js')

const app = new Application({
  path: electronPath,
  env: {NODE_ENV: "test"},
  args: [appPath],
  chromeDriverLogPath: "/home/johns10/cd.log",
  connectionRetryCount: 0,
  port: 15951
})

jest.setTimeout(10000)

describe("App", () => {
  beforeEach(async function () {
    await app.start()
  })
  afterEach(async function () {
    if (app && app.isRunning()) {
      await app.stop()
    }
  })

  test("should launch app", async () => {
    expect(true)
  });
});