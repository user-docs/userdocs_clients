const { stepHandlers } = require('../src/automation/puppeteer/stepHandlers')
const { Puppet } = require('../src/automation/puppet')

var browser
const url = 'https://the-internet.herokuapp.com/add_remove_elements/'
selector = "//button[contains(., 'Add Element')]"
annotationId = 1

defaultWidth = 32
defaultHeight = 32
defaultFontSize = 24
defaultColor = 'green'

css = `
  .userdocs-locator{
    position: relative;
    width: 1;
    height: 1;
    background: black;
    float: right;
  }
  .userdocs-wrapper{
    position: absolute;
    transform:translate(-50%, -50%);
    display: flex;
    align-content: center;
    text-align: center;
  }
  .userdocs-badge{
    display: inline-block;
    min-width: 1em; /* em unit */
    border-radius: 50%;
    font-size: 24px;
    text-align: center;
    background: ${defaultColor};
    color: #fefefe;
  }
`

beforeAll( async () => { 
  browser = await Puppet.openBrowser({ environment: 'desktop', css: css });
  const page = (await browser.pages())[0];
  await page.goto(url);
})

/*afterAll( async () => { await Puppet.closeBrowser(browser, {}); });

afterEach( async () => {
  const handler = stepHandlers["Clear Annotations"]
  await handler(browser, {})
});*/

test ('Apply Badge Annotation with no args has the defaults set', async () => {
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { id: annotationId, annotationType: { name: 'Badge' }, label: '1', xOrientation: 'L', yOrientation: 'B' }
  }

  const page = (await browser.pages())[0];
  const handler = stepHandlers["Apply Annotation"]
  await handler(browser, step)
  const wrapperHandle = await page.$(`#userdocs-annotation-${annotationId}-wrapper`)
  let width = await page.evaluate(element => {  
    console.log(element)
    style = getComputedStyle(element)
    console.log(style)
  }, wrapperHandle)
  expect(width).toBe(`${defaultWidth}px`)
})

/*
test('Apply Badge Annotation with args sets the style stuffs', async () => {
  let size = 16
  let fontSize = 24
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { id: annotationId, annotationType: { name: 'Badge' }, size: size, fontSize: fontSize, color: 'green', xOffset: 0, yOffset: 0, xOrientation: 'M', yOrientation: 'B', label: '1' }
  }

  const page = (await browser.pages())[0];
  const handler = stepHandlers["Apply Annotation"]
  await handler(browser, step)
  const wrapperHandle = await page.$(`#userdocs-annotation-${annotationId}-badge`)
  let width = await page.evaluate(element => { return getComputedStyle(element).width }, wrapperHandle)
  let finalFontSize = await page.evaluate(element => { return getComputedStyle(element).fontSize }, wrapperHandle)
  expect(width).toBe(`${size * 2}px`)
  expect(fontSize).toBe(`${finalFontSize}`)
})

test('Apply Outline Annotation', async () => {
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { id: annotationId, annotationType: { name: 'Outline' }, thickness: 6, color: 'green' }
  }

  const page = (await browser.pages())[0];
  const handler = stepHandlers["Apply Annotation"]
  await handler(browser, step)
  const wrapperHandle = await page.$(`#userdocs-annotation-${annotationId}-outline`)
  
  expect(wrapperHandle).toHaveProperty('_remoteObject')
})
test('Apply Blur Annotation', async () => {
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { id: annotationId, annotationType: { name: 'Blur' } }
  } 

  const page = (await browser.pages())[0];
  const handler = stepHandlers["Apply Annotation"]
  await handler(browser, step)
  const handle = (await page.$x('//button'))[0]
  expect(handle).toHaveProperty('_remoteObject')
})


test('Apply Badge Outline Annotation', async () => {
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { id: annotationId, annotationType: { name: 'Badge Outline' }, thickness: 6, size: 16, fontSize: 24, color: 'green', xOffset: 0, yOffset: 0, xOrientation: 'R', yOrientation: 'T', label: '1' }
  }

  const page = (await browser.pages())[0];
  const handler = stepHandlers["Apply Annotation"]
  await handler(browser, step)
  const wrapperHandle = await page.$(`#userdocs-annotation-${annotationId}-outline`)
  const badgeHandle = await page.$(`#userdocs-annotation-${annotationId}-badge`)
  expect(wrapperHandle).toHaveProperty('_remoteObject')
  expect(badgeHandle).toHaveProperty('_remoteObject')
})

test('Clear Annotations clears annotations', async () => {
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { id: annotationId, annotationType: { name: 'Outline' }, thickness: 6, color: 'green' }
  }

  const page = (await browser.pages())[0];
  const annotationHandler = stepHandlers["Apply Annotation"]
  await annotationHandler(browser, step)
  const wrapperHandle = await page.$(`#userdocs-annotation-${annotationId}-outline`)
  expect(wrapperHandle).toHaveProperty('_remoteObject')
  const clearHandler = stepHandlers["Clear Annotations"]
  await clearHandler(browser, step)
  const nullHandle = await page.$(`#userdocs-annotation-${annotationId}-outline`)
  expect(nullHandle).toBeNull()
})

test('Annotations that throw result in thrown errors', async () => {
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { annotationType: { name: 'Throw' } }
  }
  const page = (await browser.pages())[0];
  const handler = stepHandlers["Apply Annotation"]
  // await handler(browser, step) # It throws, set up assertion
})
*/