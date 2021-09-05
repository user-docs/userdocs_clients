import * as StepInstance from './stepInstance'
import * as ProcessInstance from './processInstance'
import { Runner, Configuration } from '../runner/runner'

export interface JobInstance {
  uuid: string,
  id?: string,
  jobId: string,
  status: string,
  name: string,
  errors?: Array<Error>,
  stepInstances?: Array<StepInstance.StepInstance>,
  processInstances?: Array<ProcessInstance.ProcessInstance>,
  startedAt?: Date,
  finishedAt?: Date
}

export function prepare(jobInstance: JobInstance) {
  const processInstances = jobInstance.processInstances.map(pI => {pI.type = 'processInstance'; return pI})
  const stepInstances = jobInstance.stepInstances.map(sI => {sI.type = 'stepInstance'; return sI})
  return [...processInstances, ...stepInstances].sort((i1, i2) => {return i1.order - i2.order})
}

export async function execute(jobInstance: JobInstance, runner: Runner, configuration: Configuration) {
  jobInstance.status = 'started'
  console.log("Executing JobInstance")
  if(configuration.callbacks.updateJobInstance) configuration.callbacks.updateJobInstance(jobInstance)
  const queue = prepare(jobInstance)
  for (var instance of queue) {
    if(instance.type == "processInstance") {
      await ProcessInstance.execute(instance as ProcessInstance.ProcessInstance, runner, configuration)
    } else if(instance.type == "stepInstance") {
      await StepInstance.execute(instance as StepInstance.StepInstance, runner, configuration)
    }
    if(instance.status == "failed") {
      jobInstance.status = "warning"
      jobInstance.errors.push(Error(`${instance.type} ${instance.id} failed execution`))
      if(configuration.callbacks.updateJobInstance) configuration.callbacks.updateJobInstance(jobInstance)
    }
  }
  const statuses = queue.map(i => i.status)
  if("failed" in statuses) jobInstance.status = "warning"
  else jobInstance.status = "complete"
  if(configuration.callbacks.updateJobInstance) configuration.callbacks.updateJobInstance(jobInstance)
  return jobInstance
}

export function allowedFields(jobInstance: JobInstance) {
  return {
    id: jobInstance.id,
    status: jobInstance.status
  }
}