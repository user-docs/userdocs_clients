import * as StepInstance from './stepInstance'
import * as ProcessInstance from './processInstance'

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

export function allowedFields(jobInstance: JobInstance) {
  return {
    id: jobInstance.id,
    status: jobInstance.status
  }
}