import * as Step from './step'
export interface JobStep {
  id: string,
  jobId: string,
  order: number,
  stepId: string,
  step: Step.Step,
  type: string
}

export function allowedFields(JobStep: JobStep) {
  return "Not Implemented"
}