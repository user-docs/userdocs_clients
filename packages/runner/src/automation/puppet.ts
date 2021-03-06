import { Step } from '../domain/step'
import { stepHandlers } from './puppeteer/stepHandlers'
import { currentPage } from './puppeteer/helpers'
import { Runner, Configuration } from '../runner/runner'
import { Browser, Puppeteer } from 'puppeteer-core'
import { PUPPETEER_REVISIONS } from 'puppeteer-core/lib/cjs/puppeteer/revisions'
const puppeteer = require('puppeteer-core')
const path = require('path')
import * as fs from 'fs';

export const Puppet = {
  stepHandler: (step: Step) => {
    var name: string
    try {
      name = step.stepType.name
    } catch(error) {
      throw new Error(`Improper step type ${step.stepType} passed to stepHandler`)
    }
    const handler = stepHandlers[name]
    if (handler) return handler
    else throw new Error(`Handler not found for ${step.stepType.name}`)
  },
  openBrowser: async(runner: Runner, configuration: Configuration) => {
    console.log(`Starting Open Browser ${configuration.environment}`)
    if(!configuration.chromePath) throw new Error("Chrome path not included, browser cannot start")
    if(!configuration.environment) throw new Error("Environment not included, browser cannot start")
    const indexPath = configuration.indexPath ? configuration.indexPath : "https://www.user-docs.com"
    const extensionPathNew = extensionPathHelper(configuration)
    var executablePath
    var args
    console.log("Index Path will be ", indexPath)
    
    if(configuration.environment == 'development') {
      executablePath = configuration.chromePath
      args = puppeteer.defaultArgs()
      if (configuration.userDataDirPath) {
        args.push('--user-data-dir=' + configuration.userDataDirPath);
      }
      args = standardArgs(args, indexPath, extensionPathNew)
    } else if(configuration.environment == 'desktop') {
      executablePath = configuration.chromePath
      args = puppeteer.defaultArgs()
      if (configuration.userDataDirPath) {
        args.push('--user-data-dir=' + configuration.userDataDirPath);
      }
      args = standardArgs(args, indexPath, extensionPathNew)
    } else if(configuration.environment == 'cicd') {
      const isPkg = typeof (process as any).pkg !== 'undefined';

      executablePath = '/usr/bin/chromium-browser'

      args = puppeteer.defaultArgs()
        .concat('--single-process')
        .concat('--no-zygote')
        .concat('--no-sandbox')
        .concat('--hide-scrollbars')
    } else if (configuration.environment == 'test') {
      executablePath = puppeteer.executablePath()
      args = puppeteer.defaultArgs()           
        .concat('--single-process')
        .concat('--no-zygote')
        .concat('--no-sandbox')
        .concat('--hide-scrollbars')
    } else args = puppeteer.defaultArgs() 

    const browser = await puppeteer.launch({ 
      executablePath: executablePath,
      ignoreDefaultArgs: true,
      defaultViewport: { width: 800, height: 800 },
      args: args 
    });

    const pages = await browser.pages()
    const path = require.resolve('@userdocs/annotations')
    const annotationsText = await fs.readFileSync(path, 'utf-8')
    for (var page of pages) {
      if (configuration.css) {
        await page.evaluateOnNewDocument((css, annotations)=>{
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = css
          var script = document.createElement('script');
          script.type = 'text/javascript'
          script.innerHTML = annotations
          document.addEventListener('DOMContentLoaded', () => { 
            var head = document.getElementsByTagName('head')[0]
            head.appendChild(style);
            head.appendChild(script); 
          }, false); 
        }, `${configuration.css}`, annotationsText);
      }
      page.evaluate((configuration)  => {
        localStorage.setItem('token', configuration.token)
        localStorage.setItem('wsUrl', configuration.wsUrl)
        localStorage.setItem('userId', configuration.userId.toString())
      }, configuration)
    }

    return browser
  },
  closeBrowser: async(browser: Browser) => {
    browser.removeAllListeners()
    browser = await removeListenersFromDocuments(browser)
    await browser.close()
    return
  },
  updateSession: async(browser: Browser, tokens) => {
    const pages = await browser.pages()
    for (var page of pages) {
      page.evaluate((tokens) => {
        localStorage.setItem('token', tokens.token)
        window.postMessage({token: tokens.token, action: "putToken"}, '*')
      }, tokens)
    }
  },
  sendMessage: async(browser: Browser, message) => {
    const pages = await browser.pages()
    message.source = "UserDocs"
    for (var page of pages) {
      page.evaluate((message) => { window.postMessage(message, '*') }, message)
    }
  },
  fetchBrowser: async(runner: Runner, configuration: Configuration) => {
    if(!configuration.chromiumPath && configuration.environment != 'test') throw new Error("Chromium Path doesn't exist")
    var fetcherOptions = {}
    if(configuration.environment == 'desktop') fetcherOptions['path'] = configuration.chromiumPath
    const browserFetcher = puppeteer.createBrowserFetcher(fetcherOptions);
    const localRevision = await browserFetcher.localRevisions('chrome')
    const targetRevision = PUPPETEER_REVISIONS.chromium
    console.log(`Targetted revision is ${targetRevision}, local revisions are ${localRevision}`)
    if(!localRevision.includes(targetRevision)) {
      await browserFetcher.download(targetRevision)
    }
    console.log("Completed Browser Fetch Operation")
    return await browserFetcher.revisionInfo(targetRevision).executablePath
  },
  navigate: async(runner: Runner, configuration: Configuration, url: string) => {
    const page = await currentPage(runner.automationFramework.browser)
    await page.goto(url, {timeout: configuration.browserTimeout}) 
  }
}

async function removeListenersFromDocuments(browser) {
  const pages = await browser.pages()
  for (var page of pages) {
    await page.removeAllListeners()
    await page.evaluate(() => {
      (document as any).outerHTML = (document as any).outerHTML
    })
  }
  return browser
}

export function extensionPathHelper(configuration) {
  var extensionPath
  switch(configuration.environment) {
    case 'development':
      extensionPath = path.join(require.resolve('@userdocs/extension'), '/..', '/..')
      break
    case 'desktop':
      extensionPath = configuration.appPath
      extensionPath = path.join(extensionPath, '/..', '/..')
      extensionPath = path.join(extensionPath, "resources", "app.asar.unpacked", "node_modules", "@userdocs", "extension", "extension")
      break
  }
  return extensionPath
}

export function standardArgs(args, indexPath, extensionPathNew) {
  indexPath = indexPath.replaceAll('\\', '/')
  return args
    .filter(arg => String(arg).toLowerCase() !== '--disable-extensions')
    .filter(arg => String(arg).toLowerCase() !== '--headless')
    .filter(arg => String(arg).toLowerCase() !== 'about:blank')
    .concat('--no-zygote')
    .concat('--no-sandbox')
    .concat("--proxy-server='direct://'")
    .concat('--proxy-bypass-list=*')
    .concat('--hide-scrollbars')
    .concat('--autoplay-policy=user-gesture-required')
    .concat('--disable-background-networking')
    .concat('--disable-background-timer-throttling')
    .concat('--disable-backgrounding-occluded-windows')
    .concat('--disable-breakpad')
    .concat('--disable-client-side-phishing-detection')
    .concat('--disable-component-update')
    .concat('--disable-default-apps')
    .concat('--disable-dev-shm-usage')
    .concat('--disable-domain-reliability')
    .concat('--disable-features=AudioServiceOutOfProcess')
    .concat('--disable-hang-monitor')
    .concat('--disable-ipc-flooding-protection')
    .concat('--disable-notifications')
    .concat('--disable-offer-store-unmasked-wallet-cards')
    .concat('--disable-popup-blocking')
    .concat('--disable-print-preview')
    .concat('--disable-prompt-on-repost')
    .concat('--disable-renderer-backgrounding')
    .concat('--disable-setuid-sandbox')
    .concat('--disable-speech-api')
    .concat('--disable-sync')
    .concat('--hide-scrollbars')
    .concat('--ignore-gpu-blacklist')
    .concat('--metrics-recording-only')
    .concat('--mute-audio')
    .concat('--no-default-browser-check')
    .concat('--no-first-run')
    .concat('--no-pings')
    .concat('--password-store=basic')
    .concat('--use-gl=swiftshader')
    .concat('--use-mock-keychain')
    .concat('--disable-software-rasterizer')
    .concat(`--load-extension=${extensionPathNew}`)
    .concat("file://" + indexPath)
}