import { gql } from 'graphql-request'

export const UPDATE_JOB = gql `
mutation UpdateJob(
  $id: ID!,
  $lastJobInstance: JobInstanceInput!
  $jobProcesses: [ JobProcessInput! ]
) {
  updateJob(
    id: $id,
    lastJobInstance: $lastJobInstance,
    jobProcesses: $jobProcesses
  ) {
    id
    jobProcesses {
      id
      process {
        id
        steps {
          id
          lastStepInstance {
            id
            status
          }
        }
      }
    }
    lastJobInstance {
      id
      status
    }
  }
}
`