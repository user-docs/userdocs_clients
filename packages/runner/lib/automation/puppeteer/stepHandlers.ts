import { Step } from '../../domain/step'
import { currentPage, getElementHandle } from './helpers'
import { Page, ElementHandle, Browser } from 'puppeteer'
import { StyleFunctionsText } from '../../annotation/style'
import { annotationHandlers } from '../../annotation/annotation'
import { Configuration } from '../automation'
import * as fs from 'fs/promises';

const path = require('path')

interface StepHandler {
  [ key: string ]: Function
}

export const stepHandlers: StepHandler = {
  "Navigate": async(browser: Browser, step: Step) => {
    const url = step.page.url
    const page: Page | undefined = await currentPage(browser)

    if (page) {
      await page.goto(url) 
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
    await new Promise(resolve => setTimeout(resolve, 500));
    let handle = await getElementHandle(browser, selector, strategy)
    if (!handle) { throw new ElementNotFound(strategy, selector) }
    let base64 = await handle.screenshot({ encoding: "base64"});
    var fileName = step.screenshot.name 
      ? step.screenshot.name 
      : step.process.name + " " + step.order + ".png"

    if(configuration.imagePath != '') {
      const filePath = path.join(configuration.imagePath, fileName)
      await writeFile(filePath, base64);
    }

    if (step.screenshot === null) { 
      step.screenshot = { base64: base64, stepId: step.id }
    } else {
      step.screenshot.base64 = base64
    } 
    return step
  },
  "Full Screen Screenshot": async(browser: Browser, step: Step, configuration: Configuration) => {
    const processName = step.process ? step.process.name : ""
    const stepOrder = step.order
    await new Promise(resolve => setTimeout(resolve, 500));  
    const page: Page | undefined = await currentPage(browser) 
    if (!page) { throw new Error("Page not retreived from browser") }
    let base64: any = await page.screenshot({ encoding: "base64" });  

    var fileName = step.screenshot.name 
      ? step.screenshot.name 
      : step.process.name + " " + step.order + ".png"

    if(configuration.imagePath != '') {
      const filePath = path.join(configuration.imagePath, fileName)
      await writeFile(filePath, base64);
    }

    if (step.screenshot === null) { 
      step.screenshot = { base64: base64, stepId: step.id }
    } else {
      step.screenshot.base64 = base64
    }
    return step
  },
  "Clear Annotations": async(browser: Browser, step: Step, configuration: Configuration) => {
    const page: Page | undefined = await currentPage(browser)
    if (!page) { throw new Error("Page not retreived from browser") }
    page.evaluate(() => {
      for (let i = 0; i < (window as any).active_annotations.length; i++) {
        document.body.removeChild((window as any).active_annotations[i]);
      }
      (window as any).active_annotations = []
    })
    return step
  },
  "Scroll into View": async(browser: Browser, step: Step) => { 
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