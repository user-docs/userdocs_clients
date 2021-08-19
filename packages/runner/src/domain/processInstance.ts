import * as Process from './process'
import { Runner, Configuration } from '../runner/runner'
import * as StepInstance from './stepInstance'

export interface ProcessInstance {
  uuid: string,
  id?: string,
  order: number,
  status: string,
  name: string,
  type: string,
  process?: Process.Process,
  processId: string,
  stepInstances?: Array<StepInstance.StepInstance>,
  errors?: Array<Error>,
  warnings?: Array<Error>,
  startedAt?: Date,
  finishedAt?: Date
}

export async function execute(processInstance: ProcessInstance, runner: Runner, configuration: Configuration) {
  processInstance.status = 'started'
  console.log("Executing ProcessInstance")
  if(configuration.callbacks.updateProcessInstance) configuration.callbacks.updateProcessInstance(processInstance)
  for(var stepInstance of processInstance.stepInstances) {
    await StepInstance.execute(stepInstance, runner, configuration)
    if(stepInstance.status == "failed") {
      processInstance.status = "failed"
      processInstance.errors = stepInstance.errors
      if(configuration.callbacks.updateProcessInstance) configuration.callbacks.updateProcessInstance(processInstance)
      return processInstance
    }
  }
  processInstance.status = "complete"
  if(configuration.callbacks.updateProcessInstance) configuration.callbacks.updateProcessInstance(processInstance)
  return processInstance
}


export function allowedFields(processInstance: ProcessInstance) {
  return {
    id: processInstance.id,
    status: processInstance.status
  }
}
/*
function start(processInstance: ProcessInstance) {
  //console.log(`Starting Process Instance ${processInstance.name}`) 
}

async function run(processInstance: ProcessInstance, handlerName: string, configuration: Configuration) {
  for(const stepInstance of processInstance.stepInstances) {

    const stepInstanceHandler = StepInstance[handlerName]
    const completedStepInstance = await stepInstanceHandler(stepInstance, configuration)

    if (completedStepInstance.status == 'failed') {
      console.warn(`Execution of process instance ${processInstance.name} failed on Step Instance ${stepInstance.name} for ${stepInstance.errors}`)
      processInstance.errors = processInstance.errors
        .concat(stepFailedError(processInstance, completedStepInstance))
        .concat(stepInstance.errors)
      processInstance.status = 'failed'
      return processInstance
    }
  }

  processInstance.status = 'complete'
  return processInstance
}

export function stepFailedError(processInstance: ProcessInstance, stepInstance: StepInstance.StepInstance) {
  var error = new Error()
  error.name = 'StepExecutionFailed'
  error.message = 
    `Process Instance ${processInstance.id}, ${processInstance.name} failed while executing 
    StepInstance ${stepInstance.id}, ${stepInstance.name}`
  error.stack = ""
  return error
}

export const UPDATE_PROCESS_INSTANCE = gql `
  mutation UpdateProcessInstance($id: ID!, $status: String!, $stepInstances: [ StepInstanceInput ] ) {
    updateProcessInstance(id: $id, status: $status, stepInstances: $stepInstances) {
      id
      status
    }
  }
`
*/