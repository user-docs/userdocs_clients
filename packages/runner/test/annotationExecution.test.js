const { stepHandlers } = require('../lib/automation/puppeteer/stepHandlers')
const { Puppet } = require('../lib/automation/puppet')

var browser
const url = 'https://the-internet.herokuapp.com/add_remove_elements/'
selector = "//button[contains(., 'Add Element')]"
annotationId = 1

beforeAll( async () => { 
  browser = await Puppet.openBrowser({});
  const page = (await browser.pages())[0];
  await page.goto(url);
})

afterAll( async () => { await Puppet.closeBrowser(browser, {}); });

afterEach( async () => {
  const handler = stepHandlers["Clear Annotations"]
  await handler(browser, {})
});

test('Apply Badge Annotation', async () => {
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { id: annotationId, annotationType: { name: 'Badge' }, size: 16, fontSize: 24, color: 'green', xOffset: 0, yOffset: 0, xOrientation: 'M', yOrientation: 'B', label: '1' }
  }

  const page = (await browser.pages())[0];
  const handler = stepHandlers["Apply Annotation"]
  await handler(browser, step)
  const wrapperHandle = await page.$(`#userdocs-annotation-${annotationId}-wrapper`)
  expect(wrapperHandle).toHaveProperty('_remoteObject')
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