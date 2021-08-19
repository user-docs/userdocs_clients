import * as Step from './step'
import { Runner, Configuration } from '../runner/runner'
import { fetchCallbacks } from './helpers'

export interface StepInstance {
  uuid: string,
  id?: string,
  order: number,
  status: string,
  name: string,
  type: string,
  step?: Step.Step,
  stepId: string,
  errors?: Array<Error>,
  warnings?: Array<Error>,
  startedAt?: Date,
  finishedAt?: Date,
  processInstanceUuid?: string,
  processInstanceId?: string
}

export async function execute(stepInstance: StepInstance, runner: Runner, configuration: Configuration) {
  stepInstance.status = 'started'
  console.log("Executing Step Instance")
  
  try {
    await Step.execute(stepInstance.step, runner, configuration)
    stepInstance.status = 'complete'
    if(configuration.callbacks.updateStepInstance) configuration.callbacks.updateStepInstance(stepInstance)
  } catch(error) {
    const formattedError = formatError(error)
    if (Array.isArray(stepInstance.errors) == true) stepInstance.errors.push(formattedError)
    else stepInstance.errors = [formattedError]
    stepInstance.status = 'failed'
    if(configuration.callbacks.updateStepInstance) configuration.callbacks.updateStepInstance(stepInstance)
  }
  return stepInstance
}

export function allowedFields(stepInstance: StepInstance) {
  return {
    id: stepInstance.id,
    status: stepInstance.status
  }
}

function formatError(error: Error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack
  }
}
/*
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
*/
/*
export const STEP_INSTANCE_STATUS = gql`
  fragment StepInstanceStatus on StepInstance {
    id
    status
  }
`

export const UPDATE_STEP_INSTANCE = gql `
  mutation UpdateStepInstance($id: ID!, $status: String! $step: StepInput) {
    updateStepInstance(id: $id, status: $status, step: $step) {
      id
      status
      step {
        id
        name
        screenshot {
          id
        }
      }
    }
  }
`

export const UPDATE_STEP_INSTANCE_STATUS = gql`
  ${STEP_INSTANCE_STATUS}
  mutation UpdateStepInstanceStatus($status: String!, $id: ID!) {
    UpdateStepInstance(id: $id, status: $status) {
      ...StepInstanceStatus
    }
  }
`

*/