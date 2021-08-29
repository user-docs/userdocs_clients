import * as Puppet from '../automation/puppet'
import * as Step from '../domain/step'
import * as StepInstance from '../domain/stepInstance'
import * as ProcessInstance from '../domain/processInstance'
import * as Process from '../domain/process'
import * as Helpers from '../domain/helpers'
import * as Job from '../domain/job'

export interface Override {
  url: string,
  project_id: number
}

export interface Runner {
  automationFramework: any,
  maxRetries: number,
  maxWaitTime: number,
  environment: string,
  strategy?: string,
  css?: string,
  overrides?: Array<Override>,
  appDataDir: string,
  appPath: string,
  callbacks?: any,
  continue: boolean
}

export interface Configuration {
  browser?: object, 
  maxRetries: number,
  maxWaitTime: number,
  automationFrameworkName: string,
  userDataDirPath?: string,
  imagePath?: string,
  environment: string,
  strategy?: string,
  css?: string,
  overrides?: Array<Override>,
  appDataDir: string,
  appPath: string,
  lib?: { [ key: string ]: Function } // need?,
  callbacks: any,
  chromePath: string,
  browserTimeout: number,
  token?: string,
  wsUrl?: string,
  userId?: number
}

const automationFrameworks = {
  puppeteer: Puppet.Puppet
}

export function initialize(configuration: Configuration) {
  var runner: Runner = {
    automationFramework: automationFrameworks[configuration.automationFrameworkName],
    maxRetries: configuration.maxRetries,
    maxWaitTime: configuration.maxWaitTime,
    environment: configuration.environment,
    css: configuration.css,
    overrides: configuration.overrides,
    appDataDir: configuration.appDataDir,
    appPath: configuration.appPath,
    continue: false
  }
  return runner
}

export async function openBrowser(runner: Runner, configuration: Configuration) {
  const browser = await runner.automationFramework.openBrowser(runner, configuration)
  runner.automationFramework.browser = browser
  return runner
}

export async function closeBrowser(runner: Runner) {
  await runner.automationFramework.closeBrowser(runner.automationFramework.browser)
  return runner
}

export async function executeStep(step: Step.Step, runner: Runner, configuration: Configuration) {
  const completedStep = await Step.execute(step, runner, configuration)
  return completedStep
}

export async function executeStepInstance(stepInstance: StepInstance.StepInstance, runner: Runner, configuration: Configuration) {
  runner.continue = true
  const completedStepInstance = await StepInstance.execute(stepInstance, runner, configuration)
  runner.continue = false
  return completedStepInstance
}

export async function executeProcess(process: Process.Process, runner: Runner, configuration: Configuration) {
  const completedProcess = await Process.execute(process, runner, configuration)
  return completedProcess
}

export async function executeProcessInstance(processInstance: ProcessInstance.ProcessInstance, runner: Runner, configuration: Configuration) {
  const completedProcess = await ProcessInstance.execute(processInstance, runner, configuration)
  return completedProcess
}

export async function executeJob(job: Job.Job, runner: Runner) {
  const completedJob = await Job.execute(job, runner)
  return completedJob
}

export async function refreshSession(runner: Runner, tokens) {
  console.log("Runner Refresh Session")
  const browser = runner.automationFramework.browser
  if(browser) runner.automationFramework.updateSession(browser, tokens)
}