import { Step } from '../domain/step'
import { stepHandlers } from './puppeteer/stepHandlers'
import { Runner, Configuration } from '../runner/runner'
import { Browser, Page } from 'puppeteer'
const path = require('path')
const puppeteer = require('puppeteer')

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
    var executablePath
    const extensionPathNew = extensionPathHelper(runner)
    var args

    if(configuration.environment == 'development') {
      executablePath = puppeteer.executablePath() 
      args = puppeteer.defaultArgs()
      args = standardArgs(args)
      args = args.concat(`--load-extension=${extensionPathNew}`)
      if (configuration.userDataDirPath) {
        args.push('--user-data-dir=' + configuration.userDataDirPath);
      }
    } else if(configuration.environment == 'desktop') {
      executablePath = puppeteer.executablePath().replace("app.asar", "app.asar.unpacked")
      args = puppeteer.defaultArgs()
      args = standardArgs(args)
      args = args.concat(`--load-extension=${extensionPathNew}`)
        //.concat("--disable-extensions-except=/home/johns10/Documents/userdocs_clients/packages/extension/extension")
      if (configuration.userDataDirPath) {
        args.push('--user-data-dir=' + configuration.userDataDirPath);
      }
    } else if(configuration.environment == 'cicd') {
      const isPkg = typeof (process as any).pkg !== 'undefined';

      executablePath = '/usr/bin/chromium-browser'

      args = puppeteer.defaultArgs()
        .concat('--single-process')
        .concat('--no-zygote')
        .concat('--no-sandbox')
        .concat('--hide-scrollbars')
    } else if (configuration.environment == 'test') {
      args = puppeteer.defaultArgs()
        .concat('--single-process')
        .concat('--no-zygote')
        .concat('--no-sandbox')
        .concat('--hide-scrollbars')
    } else args = puppeteer.defaultArgs() 

    console.log(args)

    const browser = await puppeteer.launch({ 
      executablePath: executablePath,
      ignoreDefaultArgs: true,
      args: args 
    });

    const pages = await browser.pages()
    for (var page of pages) {
      if (configuration.css) {
        await page.evaluateOnNewDocument((css)=>{
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = css
          document.addEventListener('DOMContentLoaded', () => { 
            document.getElementsByTagName('head')[0].appendChild(style); 
          }, false); 
        }, `${configuration.css}`);
      }
      //page.exposeFunction('sendEvent', configuration.browserEvent)
    }

    return browser
  },
  closeBrowser: async(browser: Browser) => {
    browser.removeAllListeners()
    browser = await removeListenersFromDocuments(browser)
    await browser.close()
    return
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
  console.log(`Calculated extension path as ${extensionPath}`)
  return extensionPath
}

export function standardArgs(args) {
  return args
    .filter(arg => String(arg).toLowerCase() !== '--disable-extensions')
    .filter(arg => String(arg).toLowerCase() !== '--headless')
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
}