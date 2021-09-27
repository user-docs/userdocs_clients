const { existsSync, unlink } = require('fs')
const path = require('path')
const { isObject } = require('util')
const { Puppet } = require('../src/automation/puppet')
const StepFixtures = require('./fixtures/step.js')

var browser
const CONFIGURATION = { imagePath: './', environment: 'test', overrides: [], callbacks: {createScreenshot: createScreenshot} }
beforeAll( async () => { 
  chromePath = await Puppet.fetchBrowser({}, CONFIGURATION)
  CONFIGURATION["chromePath"] = chromePath
  browser = await Puppet.openBrowser({}, CONFIGURATION); 
}, 90000);
afterAll( async () => { await Puppet.closeBrowser(browser, {}); });

test('navigate navigates', async () => {
  url = 'https://the-internet.herokuapp.com/add_remove_elements/'
  step = StepFixtures.navigate.step(url)
  const handler = Puppet.stepHandler(step)
  await handler(browser, step, CONFIGURATION)
  const page = (await browser.pages())[0]
  expect(page.url()).toBe(url)
}, 2000)
/*
test('click clicks', async () => {
  selector = "//button[contains(., 'Add Element')]"
  resultingSelector = "//button[contains(., 'Delete')]"
  step = StepFixtures.click.step(selector)
  const handler = Puppet.stepHandler(step)
  await handler(browser, step)
  await StepFixtures.click.assertion(browser, resultingSelector)
})

test('fill field fills', async () => {
  step = StepFixtures.fillField.step
  await StepFixtures.fillField.setup(browser)
  const handler = Puppet.stepHandler(step)
  await handler(browser, step)
  await StepFixtures.fillField.assertion(browser)
})

test('Set size sets size', async () => {
  step = StepFixtures.setSize.step
  const handler = Puppet.stepHandler(step)
  await handler(browser, step)
  await StepFixtures.setSize.assertion(browser)
})
*/
test('Element Screenshot takes a screenshot', async () => {
  const url = 'https://the-internet.herokuapp.com/add_remove_elements/'
  const step = { screenshot: { name: 'test' }, process: { name: 'test' }, stepType: { name: 'Element Screenshot' }, element: { selector: "//button[contains(., 'Add Element')]", strategy: { name: 'xpath' } }, marginLeft: 1, marginTop: 1, marginRight: 1, marginBottom: 5 }

  const handler = Puppet.stepHandler(step)
  const page = (await browser.pages())[0]
  await page.goto(url)
  await handler(browser, step, CONFIGURATION)
  const file_name = "test.png"
  const filePath = path.join(CONFIGURATION.imagePath, file_name)
  expect(existsSync(filePath)).toBe(true)
  //unlink(filePath, () => { "" })
}, 2000)
/*
test('Full Screen Screenshot takes a screenshot', async () => {
  const url = 'https://the-internet.herokuapp.com/add_remove_elements/'
  const configuration = { imagePath: './' }
  const step = { screenshot: {}, process: { name: 'test' }, stepType: { name: 'Full Screen Screenshot' } }

  const handler = Puppet.stepHandler(step)
  const page = (await browser.pages())[0]
  await page.goto(url)
  await handler(browser, step, configuration)
  const file_name = step.process.name + " " + step.order + ".png"
  const filePath = path.join(configuration.imagePath, file_name)
  await new Promise(resolve => setTimeout(resolve, 10));  
  expect(existsSync(filePath)).toBe(true)
  unlink(filePath, () => { "" })
})

test('Scroll to Element scrolls to an element', async () => {
  const url = 'https://the-internet.herokuapp.com/large'
  const selector = "#large-table"
  const step = { element: { selector: selector, strategy: { name: 'css' }}, stepType: { name: 'Scroll to Element' } }

  const handler = Puppet.stepHandler(step)
  const page = (await browser.pages())[0]
  await page.goto(url)
  await handler(browser, step)
  await page.waitForSelector("#large-table", { visible: true })
  const handle = await page.$(selector)
  expect(handle).toEqual(expect.any(Object))
  expect(handle).not.toBe([])
})

test ('Wait waits for an element', async() => {
  const url = 'https://the-internet.herokuapp.com/add_remove_elements/'
  const step = { screenshot: {}, process: { name: 'test' }, stepType: { name: 'Wait for Element' }, element: { selector: "//button[contains(., 'Delete')]", strategy: { name: 'xpath' } } }

  const handler = Puppet.stepHandler(step)
  const page = (await browser.pages())[0]
  await page.goto(url)
  let addElementHandle = (await page.$x("//button[contains(., 'Add Element')]"))[0]
  wait = new Promise(resolve => setTimeout(resolve, 50))
  wait.then(() => { 
    addElementHandle.click()
  })
  result = await handler(browser, step, { maxWaitTime: 100 })
  console.log("returned")
  handles = page.$x("//button[contains(., 'Delete')]")
  expect(handles).not.toBe([])
  await new Promise(resolve => setTimeout(resolve, 100))
})
*/

function createScreenshot(screenshot) {return true}