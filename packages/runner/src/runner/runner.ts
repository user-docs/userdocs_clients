import * as Puppet from '../automation/puppet'
import * as Step from '../domain/step'
import * as Process from '../domain/process'
import * as Helpers from '../domain/helpers'
import * as Job from '../domain/job'

export interface Runner {
  automationFramework: any,
  maxRetries: number,
  userDataDirPath?: string,
  imagePath?: string,
  environment: string,
  callbacks: RunnerCallbacks
}

export interface RunnerCallbacks {
  step: Callbacks,
  process: Callbacks,
  job: Callbacks
}

export interface Callbacks {
  preExecutionCallbacks: Array<Function>,
  executionCallback: Function,
  successCallbacks: Array<Function>,
  failureCallbacks: Array<Function>
}

export interface Configuration {
  browser?: object, 
  maxRetries: number,
  automationFrameworkName: string,
  userDataDirPath?: string,
  imagePath?: string,
  environment: string,
  strategy?: string,
  callbacks: {
    step: CallbackConfiguration,
    process: CallbackConfiguration,
    job: CallbackConfiguration
  },
  lib?: { [ key: string ]: Function } // need?
}

export interface CallbackConfiguration {
  preExecutionCallbacks: Array<string | Function>,
  executionCallback: string,
  successCallbacks: Array<string | Function>,
  failureCallbacks: Array<string | Function>
}

const automationFrameworks = {
  puppeteer: Puppet.Puppet
}

export function initialize(configuration: Configuration) {
  var runner: Runner = {
    automationFramework: automationFrameworks[configuration.automationFrameworkName],
    maxRetries: configuration.maxRetries,
    environment: configuration.environment,
    imagePath: configuration.imagePath,
    callbacks: {
      step: {
        preExecutionCallbacks: [],
        executionCallback: Step.handlers.run,
        successCallbacks: [],
        failureCallbacks: []
      },
      process: {
        preExecutionCallbacks: [],
        executionCallback: () => {},
        successCallbacks: [],
        failureCallbacks: []
      },
      job: {
        preExecutionCallbacks: [],
        executionCallback: () => {},
        successCallbacks: [],
        failureCallbacks: []
      }
    }
  }
  runner = configureCallbacks(runner, configuration)
  return runner
}

export function reconfigure(runner: Runner, configuration: Configuration) {
  runner.maxRetries = configuration.maxRetries,
  runner.environment = configuration.environment,
  runner.imagePath = configuration.imagePath,
  runner = configureCallbacks(runner, configuration)
  return runner
}

export function configureCallbacks(runner: Runner, configuration: Configuration) {
  const stepExecutionCallback: Function = Step.handlers[configuration.callbacks.step.executionCallback]
  if (!stepExecutionCallback) throw new Error(`Step Execution callback ${configuration.callbacks.step.executionCallback} not implemented`)

  const processExecutionCallback: Function = Process.handlers[configuration.callbacks.process.executionCallback]
  if (!processExecutionCallback) throw new Error(`Process Execution callback ${configuration.callbacks.process.executionCallback} not implemented`)

  const jobExecutionCallback: Function = Job.handlers[configuration.callbacks.job.executionCallback]
  if (!jobExecutionCallback) throw new Error(`Job Execution callback ${configuration.callbacks.job.executionCallback} not implemented`)

  runner.callbacks.step = {
    preExecutionCallbacks: Helpers.fetchCallbacks(configuration.callbacks.step.preExecutionCallbacks, Step.handlers),
    executionCallback: stepExecutionCallback,
    successCallbacks: Helpers.fetchCallbacks(configuration.callbacks.step.successCallbacks, Step.handlers),
    failureCallbacks: Helpers.fetchCallbacks(configuration.callbacks.step.failureCallbacks, Step.handlers)
  }
  runner.callbacks.process = {
    preExecutionCallbacks: Helpers.fetchCallbacks(configuration.callbacks.process.preExecutionCallbacks, Process.handlers),
    executionCallback: processExecutionCallback,
    successCallbacks: Helpers.fetchCallbacks(configuration.callbacks.process.successCallbacks, Process.handlers),
    failureCallbacks: Helpers.fetchCallbacks(configuration.callbacks.process.failureCallbacks, Process.handlers)
  }
  runner.callbacks.job = {
    preExecutionCallbacks: Helpers.fetchCallbacks(configuration.callbacks.job.preExecutionCallbacks, Job.handlers),
    executionCallback: jobExecutionCallback,
    successCallbacks: Helpers.fetchCallbacks(configuration.callbacks.job.successCallbacks, Job.handlers),
    failureCallbacks: Helpers.fetchCallbacks(configuration.callbacks.job.failureCallbacks, Job.handlers)
  }
  return runner
}

export async function openBrowser(runner: Runner) {
  const browser = await runner.automationFramework.openBrowser(runner)
  runner.automationFramework.browser = browser
  return runner
}

export async function closeBrowser(runner: Runner, configuration: Configuration) {
  await runner.automationFramework.closeBrowser(runner.automationFramework.browser, configuration)
  runner.automationFramework.browser = null
  return runner
}

export async function executeStep(step: Step.Step, runner: Runner) {
  const completedStep = await Step.execute(step, runner)
  return completedStep
}

export async function executeProcess(process: Process.Process, runner: Runner) {
  const completedProcess = await Process.execute(process, runner)
  return completedProcess
}

export async function executeJob(job: Job.Job, runner: Runner) {
  const completedJob = await Job.execute(job, runner)
  return completedJob
}