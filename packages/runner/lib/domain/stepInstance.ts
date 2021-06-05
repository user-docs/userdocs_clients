import * as Step from './step'
import { fetchCallbacks } from './helpers'
import { Configuration } from '../automation/automation'

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

export function allowedFields(stepInstance: StepInstance) {
  return {
    id: stepInstance.id,
    status: stepInstance.status
  }
}
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