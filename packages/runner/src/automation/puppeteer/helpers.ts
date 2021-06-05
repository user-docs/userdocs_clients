import { Page, Browser } from 'puppeteer'

export async function currentPage(browser: Browser) {
  let page
  const pages = await browser.pages()
  for (let i = 0; i < pages.length && !page; i++) {
    const isHidden = await pages[i].evaluate(() => document.hidden)
    if (!isHidden) {
      page = pages[i]
    }
  }
  return page
}

export async function getElementHandle(browser: Browser, selector: string, strategy: string) {
  const page: Page | undefined = await currentPage(browser)
  if(!page) { throw new Error("Page not retreived from browser") }
  if (strategy === 'css') {
    const handle: any = await page.$(selector)
    return handle
  } else if (strategy === 'xpath') {
    const handles = await page.$x(selector)
    return handles[0]
  }
}