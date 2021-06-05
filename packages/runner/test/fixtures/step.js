module.exports.navigate = {
  step: (url) => {
    return { 
      page: { url: url }, 
      stepType: { name: 'Navigate' } 
    }
  },
  assertion: async (browser, url) => {
    const page = (await browser.pages())[0]
    expect(page.url()).toBe(url)
  }
}

module.exports.click = {
  step: (selector) => {
    return { 
      stepType: { name: 'Click' }, 
      element: { selector: selector, strategy: { name: 'xpath' } } 
    }
  },
  assertion: async (browser, selector) => {
    const page = (await browser.pages())[0]
    const handle = (await page.$x(selector))[0]
    expect(handle).toEqual(expect.any(Object))
    expect(handle).not.toBe([])
  }
}

inputValue = 'John'
inputSelector = "//input[@id='username']"

module.exports.fillField = {
  step: { text: inputValue, stepType: { name: 'Fill Field' }, element: { selector: "//input[@id='username']", strategy: { name: 'xpath' }} },
  setup: async (browser) => { 
    const page = (await browser.pages())[0]
    await page.goto('https://the-internet.herokuapp.com/login')
  },
  assertion: async (browser) => {
    const page = (await browser.pages())[0]
    const handle = (await page.$x(inputSelector))[0]
    innerText = await page.evaluate(x => x.value, handle)
    expect(innerText).toBe(inputValue)
  }
}

const width = 800
const height = 600

module.exports.setSize = {
  step: { width: width, height: height, stepType: { name: 'Set Size Explicit' } },
  setup: async (browser) => { 
    const page = (await browser.pages())[0]
    await page.goto('https://the-internet.herokuapp.com/login')
  },
  assertion: async (browser) => {
    const page = (await browser.pages())[0]
    const viewport = page.viewport()
    expect(viewport.height).toBe(height)
    expect(viewport.width).toBe(width)
  }
}