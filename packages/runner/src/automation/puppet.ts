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
  openBrowser: async(runner: Runner) => {
    var executablePath = puppeteer.executablePath()
    var extensionPath
    var args

    if(runner.environment == 'development') {
      executablePath = puppeteer.executablePath() 
      extensionPath =  require.resolve('@userdocs/extension')
      extensionPath = path.join(extensionPath, '/..', '/..')
      args = puppeteer.defaultArgs()
        .filter(arg => String(arg).toLowerCase() !== '--disable-extensions')
        .filter(arg => String(arg).toLowerCase() !== '--headless')
        .concat("--proxy-server='direct://'")
        .concat('--proxy-bypass-list=*')
        .concat('--hide-scrollbars')
        .concat(`--load-extension=${extensionPath}`)
        //.concat("--disable-extensions-except=/home/johns10/Documents/userdocs_clients/packages/extension/extension")
      if (runner.userDataDirPath) {
        args.push('--user-data-dir=' + runner.userDataDirPath);
      }
    } else if(runner.environment == 'desktop') {
      executablePath = puppeteer.executablePath().replace("app.asar", "app.asar.unpacked")
      extensionPath = runner.appPath
      extensionPath = path.join(extensionPath, '/..', '/..')
      extensionPath = path.join(extensionPath, "resources", "app.asar.unpacked", "node_modules", "@userdocs", "extension", "extension")
      args = puppeteer.defaultArgs()
        .filter(arg => String(arg).toLowerCase() !== '--disable-extensions')
        .filter(arg => String(arg).toLowerCase() !== '--headless')
        .concat("--proxy-server='direct://'")
        .concat('--proxy-bypass-list=*')
        .concat('--hide-scrollbars')
        .concat(`--load-extension=${extensionPath}`)
        //.concat("--disable-extensions-except=/home/johns10/Documents/userdocs_clients/packages/extension/extension")
      if (runner.userDataDirPath) {
        args.push('--user-data-dir=' + runner.userDataDirPath);
      }
    } else if(runner.environment == 'cicd') {
      const isPkg = typeof (process as any).pkg !== 'undefined';

      executablePath = '/usr/bin/chromium-browser'

      args = puppeteer.defaultArgs()
        .concat('--single-process')
        .concat('--no-zygote')
        .concat('--no-sandbox')
        .concat('--hide-scrollbars')
    } else if (runner.environment == 'test') {
      args = puppeteer.defaultArgs()
        .concat('--single-process')
        .concat('--no-zygote')
        .concat('--no-sandbox')
        .concat('--hide-scrollbars')
    } else args = puppeteer.defaultArgs() 

    const browser = await puppeteer.launch({ 
      executablePath: executablePath,
      ignoreDefaultArgs: true,
      args: args 
    });

    const pages = await browser.pages()
    for (var page of pages) {
      if (runner.css) {
        await page.evaluateOnNewDocument((css)=>{
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = css
          document.addEventListener('DOMContentLoaded', () => { 
            document.getElementsByTagName('head')[0].appendChild(style); 
          }, false); 
        }, `${runner.css}`);
      }
      page.exposeFunction('sendEvent', runner.callbacks.browserEvent)
    }

    return browser
  },
  closeBrowser: async(browser: Browser, configuration: Configuration) => {
    await browser.close()
  }
}