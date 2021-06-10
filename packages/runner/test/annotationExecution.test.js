const { stepHandlers } = require('../src/automation/puppeteer/stepHandlers')
const { Puppet } = require('../src/automation/puppet')
const readline = require('readline');

var browser
const url = 'https://the-internet.herokuapp.com/add_remove_elements/'
selector = "//button[contains(., 'Add Element')]"
annotationId = 1

defaultWidth = 32
defaultHeight = 32
defaultFontSize = 75
defaultColor = 'green'

css = `
  .userdocs-locator{
    position: relative;
    width: 0;
    height: 0;
    float: left;
  }
  .userdocs-mask{
    position: absolute;
  }
  .userdocs-badge {
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    transform:translate(-50%, -50%);
    color: #fff;
    background-color: ${defaultColor};
    border-radius: 50%;
    
    /* Alignment */
    line-height: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    
    /* Adjust as required: */
    padding: 10px;
    min-width: 1em; 
      padding: .3em; 
    font-size: ${defaultFontSize}px;
  }
  .userdocs-badge::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .userdocs-border {
    position: absolute;
    border-width: 6px;
    border-color: red;
    border-style: solid;
  }
`

beforeAll( async () => { 
  browser = await Puppet.openBrowser({ environment: 'desktop', css: css });
  const page = (await browser.pages())[0];
  await page.goto(url);
})

afterAll( async () => { await Puppet.closeBrowser(browser, {}); });

afterEach( async () => {
  //const ans = await askQuestion("Que? ");
  const handler = stepHandlers["Clear Annotations"]
  await handler(browser, {})
});


test ('Apply Badge Annotation with no args has the defaults set', async () => {
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { id: annotationId, annotationType: { name: 'Badge' }, label: '1', xOrientation: 'R', yOrientation: 'B' }
  }

  const page = (await browser.pages())[0];
  const handler = stepHandlers["Apply Annotation"]
  await handler(browser, step)
  const wrapperHandle = await page.$(`#userdocs-annotation-${annotationId}-badge`)
  let width = await page.evaluate(element => {  
    style = getComputedStyle(element)
    console.log(style)
    return style.fontSize
  }, wrapperHandle)
  expect(width).toBe(`${defaultFontSize}px`)
})

function askQuestion(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); 
  return new Promise(resolve => rl.question(query, ans => { rl.close(); resolve(ans); }))
}


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
  expect(finalFontSize).toBe(`${fontSize}px`)
})

test('Apply Outline Annotation', async () => {
  thickness = 6
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { id: annotationId, annotationType: { name: 'Outline' }, thickness: thickness, color: 'green' }
  }

  const page = (await browser.pages())[0];
  const handler = stepHandlers["Apply Annotation"]
  await handler(browser, step)
  const wrapperHandle = await page.$(`#userdocs-annotation-${annotationId}-outline`)
  
  let outlineWidth = await page.evaluate(element => { return getComputedStyle(element).outlineWidth }, wrapperHandle)
  expect(outlineWidth).toBe(`${thickness}px`)
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
  let color = await page.evaluate(element => { return getComputedStyle(element).textShadow }, handle)
  expect(color).toBe("rgba(0, 0, 0, 0.5) 0px 0px 5px")
})


test('Apply Badge Outline Annotation', async () => {
  thickness = 6
  fontSize = 24
  size = 16
  const step = { 
    element: { selector: selector, strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { id: annotationId, annotationType: { name: 'Badge Outline' }, thickness: thickness, size: size, fontSize: fontSize, color: 'green', xOffset: 0, yOffset: 0, xOrientation: 'R', yOrientation: 'T', label: '1' }
  }

  const page = (await browser.pages())[0];
  const handler = stepHandlers["Apply Annotation"]
  await handler(browser, step)
  const outlineHandle = await page.$(`#userdocs-annotation-${annotationId}-outline`)
  const badgeHandle = await page.$(`#userdocs-annotation-${annotationId}-badge`)
  let outlineWidth = await page.evaluate(element => { return getComputedStyle(element).outlineWidth }, outlineHandle)
  let width = await page.evaluate(element => { return getComputedStyle(element).width }, badgeHandle)
  let finalFontSize = await page.evaluate(element => { return getComputedStyle(element).fontSize }, badgeHandle)

  expect(width).toBe(`${size * 2}px`)
  expect(finalFontSize).toBe(`${fontSize}px`)
  expect(outlineWidth).toBe(`${thickness}px`)
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