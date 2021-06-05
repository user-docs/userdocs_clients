import * as Process from './process'
import * as ProcessInstance from './processInstance'
export interface JobProcess {
  id: string,
  jobId: string,
  order: number,
  processId: string,
  process: Process.Process,
  processInstance: ProcessInstance.ProcessInstance,
  type: string
}

export function allowedFields(jobProcess: JobProcess) {
  return {
    id: jobProcess.id,
    process: Process.allowedFields(jobProcess.process)
  }
}