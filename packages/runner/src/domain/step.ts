import { v4 as uuidv4 } from 'uuid';

import * as StepInstance from './stepInstance'
import { Page } from './page'
import { StepType } from './stepType'
import { Element } from './element'
import { Process } from './process'
import * as Screenshot from './screenshot'
import { Annotation } from './annotation'
import { Runner } from '../runner/runner'
export interface Step extends Object {
  id: string,
  order: number,
  name: string,
  type: string,
  url: string,
  text: string,
  width: number,
  height: number,
  stepType: StepType,
  element: Element,
  page: Page,
  process: Process,
  screenshot: Screenshot.Screenshot,
  annotation: Annotation,
  lastStepInstance?: StepInstance.StepInstance
}

export async function execute(step: Step, runner: Runner)  {
  console.group(`Starting execution of step ${step.id}, ${step.name}`)
  console.time("Step Timer")
  const handler = runner.automationFramework.stepHandler(step)
  if(!handler) throw new Error(`Handler for ${step.stepType.name} not implemented`)
  for(const callback of runner.callbacks.step.preExecutionCallbacks) { 
    step = await callback(step, runner) 
  }
  try {
    step = await runner.callbacks.step.executionCallback(step, runner)

    for(const callback of runner.callbacks.step.successCallbacks) { 
      try { step = await callback(step, runner)  }
      catch(e) { console.error("Step run problem") }
    }
    console.debug(`Execution of step ${step.id}, ${step.name} completed successfully`)

  } catch(error) {

    for(const callback of runner.callbacks.step.failureCallbacks) { 
      step = await callback(step, runner, error) 
    }

    console.debug(`Execution of step ${step.id}, ${step.name} failed because ${error}`)
    console.debug(error.stack)

  }
  console.timeEnd("Step Timer")
  console.groupEnd();
  return step
}

export const handlers = {
  embedNewStepInstance: async(step: Step, runner: Runner) => {
    const stepInstance: StepInstance.StepInstance = {
      uuid: uuidv4(),
      order: step.order,
      status: "started", //TODO: Implement additional execution callbacks
      name: step.name,
      type: "stepInstance",
      stepId: step.id,
      startedAt: new Date()
    }
    if (step.lastStepInstance) console.warn("Last Step Instance already exists, will not replace it.")
    else step.lastStepInstance = stepInstance
    return step
  },
  startLastStepInstance: async(step: Step, runner: Runner) => {
    if (!step.lastStepInstance) throw Error("Last step instance doesn't exist, can't proceed")
    if (step.lastStepInstance.stepId == null) throw Error("Last step instance step id is null, can't proceed") 
    else step.lastStepInstance.status = 'started'
    return step
  },
  run: async (step: Step, runner: Runner) => {
    const completedStep = await runWithRetries(step, runner, 0, null)
    return completedStep
  },
  completeLastStepInstance: async(step: Step, runner: Runner) => {
    step.lastStepInstance.status = 'complete'
    step.lastStepInstance.finishedAt = new Date()
    return step
  },
  completeStepInstance: async(step: Step, runner: Runner) => {
    if (!step.lastStepInstance) throw Error("Last step instance doesn't exist, can't proceed")
    if (step.lastStepInstance.stepId == null) throw Error("Last step instance step id is null, can't proceed") 
    step.lastStepInstance.status = 'complete'
    step.lastStepInstance.finishedAt = new Date()
    return step
  },
  failStepInstance: async (step: Step, runner: Runner, error: Error) => {
    step.lastStepInstance.status = 'failed'
    const formattedError = formatError(error)
    if (Array.isArray(step.lastStepInstance.errors) == true) step.lastStepInstance.errors.push(formattedError)
    else step.lastStepInstance.errors = [ formattedError ]
    return step
  },
  failLastStepInstance: async (step: Step, runner: Runner, error: Error) => {
    step.lastStepInstance.status = 'failed'
    const formattedError = formatError(error)
    if (Array.isArray(step.lastStepInstance.errors) == true) step.lastStepInstance.errors.push(formattedError)
    else step.lastStepInstance.errors = [ formattedError ]
    return step
  },
  nothing: async (step: Step, runner: Runner) => { return step },
  fail: async (step: Step, runner: Runner) => { throw new Error("This step is expected to fail for test purposes") }
}

function formatError(error: Error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack
  }
}

async function runWithRetries(step: Step, runner: Runner, retry: number, error: Error | null) {
  const maxRetries = runner.maxRetries
  const browser = runner.automationFramework.browser
  const handler = runner.automationFramework.stepHandler(step)
  const configuration = { imagePath: runner.imagePath, maxWaitTime: runner.maxWaitTime, overrides: runner.overrides }
  if (retry < maxRetries) {
    try {
      step = await handler(browser, step, configuration)
      return step
    } catch(error) {
      const backoffTime = retry ** 3
      console.warn(`Step ${step.id}, ${step.name} execution failed. Waiting ${backoffTime}. On retry ${retry} of ${maxRetries}`)
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      const retryStep: Step = await runWithRetries(step, runner, retry + 1, error)
      return retryStep
    }
  } else {
    throw error
  }
}

export function allowedFields(step: Step) {
  var fields: any = {
    id: step.id,  
    order: step.order
  }
  if(step.screenshot) fields.screenshot = step.screenshot
  if(step.lastStepInstance) { 
    fields.lastStepInstance = StepInstance.allowedFields(step.lastStepInstance) 
  }
  return fields
}

/*
export const STEP_SCREENSHOT = gql `
  fragment StepBase64 on Step {
    base64
  }
`
*/