import { Step } from '../../domain/step'
import { currentPage, getElementHandle, getElementsHandle } from './helpers'
import { Page, ElementHandle, Browser } from 'puppeteer-core'
import { StyleFunctionsText } from '../../annotation/style'
import { annotationHandlers } from '../../annotation/annotation'
import { Configuration } from '../../runner/runner'
import { timeoutPage } from '../../runner/static'
import * as fs from 'fs/promises';

const path = require('path')

interface StepHandler {
  [ key: string ]: Function
}

export const stepHandlers: StepHandler = {
  "Navigate": async(browser: Browser, step: Step, configuration: Configuration) => {
    const page: Page | undefined = await currentPage(browser)
    const overrides = configuration.overrides
    const project_id = step.page.version.project.id
    const url = step.page.url

    var baseUrl = step.page.version.project.baseUrl
    var finalUrl = ""

    const filteredOverrides = overrides.filter(o => o.project_id == project_id)

    if (filteredOverrides.length > 0) {
      const override = filteredOverrides[0]
      console.log(`Overriding base url ${override.url}`)
      baseUrl = override.url
    }

    if (url.startsWith("/")) {
      finalUrl = baseUrl + url
    } else {
      finalUrl = url
    }

    if (page) {
      try {
        await page.goto(finalUrl, {timeout: configuration.browserTimeout, waitUntil: "networkidle0"}) 
      } catch(e) {
        await page.goto('about:blank')
        await page.setContent(timeoutPage)
        throw e
      }
    } else {
      throw new Error("Page not retreived from browser")
    }


    return step
  },
  "Click": async(browser: Browser, step: Step) => {
    const selector = step.element.selector
    const strategy = step.element.strategy.name
    var handle
  
    handle = await getElementHandle(browser, selector, strategy)
    if (!handle) { throw new ElementNotFound(strategy, selector) }
    await handle.click()
    return step
  },
  "Fill Field": async(browser: Browser,  step: Step) => {
    const selector = step.element.selector
    const strategy = step.element.strategy.name
    const text = step.text
    const page: Page | undefined = await currentPage(browser) 

    let handle = await getElementHandle(browser, selector, strategy)
    if (!handle) { throw new ElementNotFound(strategy, selector) }
    await handle.type(text);
    await page.evaluate(handle => { handle.blur() }, handle) 
    return step
  },
  "Set Size Explicit": async(browser: Browser, step: Step) => {
    const width = step.width
    const height = step.height
  
    const page: Page | undefined = await currentPage(browser)

    if (page) {
      await page.setViewport({
        width: width,
        height: height,
        deviceScaleFactor: 1,
      })
    } else {
      throw "Page not retreived from browser"
    }

    return step
  },
  "Element Screenshot": async(browser: Browser, step: Step, configuration: Configuration) => {
    const selector = step.element.selector
    const strategy = step.element.strategy.name
    var fileName = step.process.name + " " + step.order + ".png"
    var filePath = ""
    await new Promise(resolve => setTimeout(resolve, 250));
    let handle = await getElementHandle(browser, selector, strategy)
    if (!handle) { throw new ElementNotFound(strategy, selector) }
    let base64 = await handle.screenshot({ encoding: "base64"});

    handleScreenshot(step, base64, configuration)

    await new Promise(resolve => setTimeout(resolve, 250));
    return step
  },
  "Full Screen Screenshot": async(browser: Browser, step: Step, configuration: Configuration) => {
    const processName = step.process ? step.process.name : ""
    const stepOrder = step.order
    var fileName = step.process.name + " " + step.order + ".png"
    var filePath = ""
    await new Promise(resolve => setTimeout(resolve, 250));  
    const page: Page | undefined = await currentPage(browser) 
    if (!page) { throw new Error("Page not retreived from browser") }
    let base64: any = await page.screenshot({ encoding: "base64" });  

    handleScreenshot(step, base64, configuration)
    
    await new Promise(resolve => setTimeout(resolve, 250));
    return step
  },
  "Clear Annotations": async(browser: Browser, step: Step, configuration: Configuration) => {
    const page: Page | undefined = await currentPage(browser)
    if (!page) { throw new Error("Page not retreived from browser") }
    page.evaluate(() => {
      const active_annotations = (window as any).active_annotations
      if (active_annotations) {
        for (let i = 0; i < active_annotations.length; i++) {
          const element = (window as any).active_annotations[i];
          element.parentNode.removeChild(element);
        }
      }
      (window as any).active_annotations = []
    })
    return step
  },
  "Scroll to Element": async(browser: Browser, step: Step) => { 
    const selector = step.element.selector
    const strategy = step.element.strategy.name
    const page: Page | undefined = await currentPage(browser)
    if (!page) { throw new Error("Page not retreived from browser") }
    let handle: ElementHandle = await getElementHandle(browser, selector, strategy)
    if (handle != undefined) {
      await page.evaluate(handle => { handle.scrollIntoView() }, handle) 
      return step
    } else {
      throw new Error("Element not found")
    }
  },
  "Apply Annotation": async(browser: Browser, step: Step) => {
    const selector = step.element.selector
    const strategy = step.element.strategy.name
    const annotationType = step.annotation.annotationType.name
    const annotationHandler = annotationHandlers[annotationType]
    if (!annotationHandler) { throw new Error(`Annotation handler ${annotationType} not implemented`) }
    const handle: ElementHandle = await getElementHandle(browser, selector, strategy)
    if (!handle) { throw new ElementNotFound(strategy, selector) }
    const page: Page | undefined = await currentPage(browser)
    if (!page) { throw new Error("Page not retreived from browser")}
    try {
      await page.evaluate(annotationHandler as any, step as any, handle, StyleFunctionsText)  //TODO: NO ANY'S
    } catch (error) {
      throw error
    }
    
    return step
  },
  "Wait for Element": async(browser: Browser, step: Step, configuration: Configuration) => {
    const selector = step.element.selector
    const strategy = step.element.strategy.name
    const page: Page | undefined = await currentPage(browser)
    if (!page) { throw new Error("Page not retreived from browser")}
    if (strategy == 'xpath') {
      console.log("Waiting", configuration.maxWaitTime)
      await page.waitForXPath(selector, { visible: true, timeout: configuration.maxWaitTime })
    } else if (strategy == 'css') {
      await page.waitForSelector(selector, { visible: true, timeout: configuration.maxWaitTime })
    }
    return step
  },
  "Enable Javascript": async(browser: Browser, step: Step, configuration: Configuration) => {
    const page: Page | undefined = await currentPage(browser)
    if (!page) { throw new Error("Page not retreived from browser")}
    await page.setJavaScriptEnabled(true)
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })
    return step
  },
  "Disable Javascript": async(browser: Browser, step: Step, configuration: Configuration) => {
    // from: https://github.com/zaqqaz/visual-unit-tests/blob/master/src/utils/testUtils.ts
    const page: Page | undefined = await currentPage(browser)
    if (!page) { throw new Error("Page not retreived from browser")}
    await page.setJavaScriptEnabled(false);
    return step
  },
  "Submit Form": async(browser: Browser, step: Step, configuration: Configuration) => {
    const selector = step.element.selector
    const strategy = step.element.strategy.name
    const page: Page | undefined = await currentPage(browser)
    if (!page) { throw new Error("Page not retreived from browser")}
    const handle: ElementHandle = await getElementHandle(browser, selector, strategy)
    await handle.evaluate(handle => (handle as any).submit())
    return step
  },
  "Send Enter Key": async(browser: Browser, step: Step, configuration: Configuration) => {
    const selector = step.element.selector
    const page: Page | undefined = await currentPage(browser)
    if (!page) { throw new Error("Page not retreived from browser")}
    await page.type(selector, String.fromCharCode(13))
    return step
  },
  "Convert to SUI": async(browser: Browser, step: Step, configuration: Configuration) => {
    const selector = step.element.selector
    const strategy = step.element.strategy.name
    const page: Page | undefined = await currentPage(browser)
    if (!page) { throw new Error("Page not retreived from browser")}
    const handles: Array<ElementHandle> = await getElementsHandle(browser, selector, strategy)
    for (const handle of handles) {
      await page.evaluate(element => {
        element.style.fontFamily = 'sui'
      }, handle)  //TODO: NO ANY'S
    }
    try {
    } catch (error) {
      throw error
    }
    return step
  }
}

async function handleScreenshot(step: Step, base64: string, configuration: Configuration) {
  var fileName = step.process.name + " " + step.order + ".png"
  var filePath = ""

  if (step.screenshot) {
    fileName = step.screenshot.name 
      ? step.screenshot.name + ".png"
      : step.process.name + " " + step.order + ".png"
  } 
  
  if(configuration.imagePath != '') {
    filePath = path.join(configuration.imagePath, fileName)
  } else {
    filePath = path.join(configuration.appDataDir, "UserDocs", "images", fileName)
  }
  
  await writeFile(filePath, base64);

  if (step.screenshot === null || step.screenshot.id == null) { 
    const screenshot = { base64: base64, stepId: step.id }
    configuration.callbacks.createScreenshot(screenshot)
  } else {
    
    step.screenshot.base64 = base64
    step.screenshot.stepId = step.id
    configuration.callbacks.updateScreenshot(step.screenshot)
  }
}

async function writeFile(path: string, base64: string) {
  try {
    await fs.writeFile(path, base64, 'base64');
  } catch (error) {
    if (error.code == 'ENOENT') {
      error.message = `Unable to write to ${process.cwd()}/${error.path}`
      throw(error)
    } else {
      throw(error)
    }
  }
}

class ElementNotFound extends Error {
  constructor(strategy, selector, ...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ElementNotFound)
    }

    this.name = 'ElementNotFound'
    this.message = 'Failed to find ' + selector + ' using ' + strategy.name
  }
}