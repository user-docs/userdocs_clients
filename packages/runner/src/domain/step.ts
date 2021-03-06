import { v4 as uuidv4 } from 'uuid';

import * as StepInstance from './stepInstance'
import { Page } from './page'
import { StepType } from './stepType'
import { Element } from './element'
import { Process } from './process'
import * as Screenshot from './screenshot'
import { Annotation } from './annotation'
import { Runner, Configuration } from '../runner/runner'
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

export async function execute(step: Step, runner: Runner, configuration: Configuration)  {
  const completedStep = await runWithRetries(step, runner, configuration, 0, null)
  return completedStep
}

async function runWithRetries(step: Step, runner: Runner, configuration, retry: number, error: Error | null) {
  const stepConfiguration = overrideConfiguration(configuration, step)
  var maxRetries
  if(stepConfiguration.maxRetries == null) maxRetries = 10
  else if(stepConfiguration.maxRetries == 0) maxRetries = 10
  else maxRetries = stepConfiguration.maxRetries 
  const browser = runner.automationFramework.browser
  const handler = runner.automationFramework.stepHandler(step)
  if(!handler) throw new Error(`Handler for ${step.stepType.name} not implemented`)
  
  if (retry < maxRetries) {
    try {
      step = await handler(browser, step, configuration)
      return step
    } catch(error) {
      const backoffTime = retry ** 3
      //console.warn(`Step ${step.id}, ${step.name} execution failed because ${error}. Waiting ${backoffTime}. On retry ${retry} of ${maxRetries}`)
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      const retryStep: Step = await runWithRetries(step, runner, stepConfiguration, retry + 1, error)
      return retryStep
    }
  } else {
    throw error
  }
}

function overrideConfiguration(configuration: Configuration, step: Step) {
  if(step.stepType.name === "Navigate") return {maxRetries: 1}
  else return {maxRetries: configuration.maxRetries}
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

function formatError(error: Error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack
  }
}
*/