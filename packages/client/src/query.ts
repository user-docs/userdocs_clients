import {gql} from 'graphql-request'

export async function executeQuery(client, query, variables, headers) {
  try {
    const response = await client.graphQLClient.request(query, variables, headers)
    return response
  } catch (e) {
    if(e.response) return e.response
    else return e
  }
}

export function updater(client, query, headers) {
  return function(stepInstance) {
    client.graphQLClient.request(query, stepInstance, headers)
  } 
}

export const getConfiguration = gql`  
query getUser {
  user {
    configuration {
      strategy
      css
      overrides {
        projectId
        url
      }
    }
  }
}
`

export const updateStepInstance = gql`
  mutation UpdateStepInstance($id: ID!, $status: String!, $errors: [ErrorInput], $warnings: [WarningInput]) {
    updateStepInstance(id: $id, status: $status, errors: $errors, warnings: $warnings) {
      id
      status
    }
  }
`
export const updateProcessInstance = gql `
  mutation UpdateProcessInstance($id: ID!, $status: String!, $errors: [ErrorInput], $warnings: [WarningInput]) {
    updateProcessInstance(id: $id, status: $status, errors: $errors, warnings: $warnings) {
      id
      status
    }
  }
`
export const updateJobInstance = gql `
  mutation UpdateJobInstance($id: ID!, $status: String!, $errors: [ErrorInput], $warnings: [WarningInput]) {
    updateJobInstance(id: $id, status: $status, errors: $errors, warnings: $warnings) {
      id
      status
    }
  }
`

const stepFieldsFragment = gql`
  fragment stepFields on Step {
    id
    order
    name
    url
    text
    width
    height
    page_reference
    annotation {
      id
      name
      label
      xOrientation
      yOrientation
      size
      color
      thickness
      xOffset
      yOffset
      fontSize
      fontColor
      annotationType {
        id
        name
      }
    }
    page {
      id
      order
      name
      url
      project {
        id
        name
        baseUrl
      }
    }
    process {
      name
      id
    }
    stepType {
      id
      name
    }
    element {
      id
      name
      selector
      strategy {
        id
        name
      }
    }
    screenshot {
      id
      name
      stepId
    }
  }
`

const errorsFragment = gql`
  fragment errorFields on Error {
    name
    message
    stack
  }
`

export const stepInstanceFieldsFragment = gql`
  ${stepFieldsFragment}
  fragment stepInstanceFields on StepInstance {
    id
    status
    order
    step {...stepFields}
  }
`

export const processInstanceFieldsFragment = gql`
  ${stepInstanceFieldsFragment}
  ${errorsFragment}
  fragment processInstanceFields on ProcessInstance {
    id
    name
    order
    status
    errors {...errorFields}
    stepInstances {...stepInstanceFields}
  }
`

export const createJobInstance = gql `
  ${stepInstanceFieldsFragment}
  ${processInstanceFieldsFragment}
  mutation createJobInstance($jobId: ID!, $status: String!) {
    createJobInstance(jobId: $jobId, status: $status) {
      id
      name
      order
      status
      stepInstances {...stepInstanceFields}
      processInstances {...processInstanceFields}
    }
  }
`

export const createProcessInstance = gql `
  ${processInstanceFieldsFragment}
  mutation createProcessInstance($processId: ID!, $status: String!) {
    createProcessInstance(processId: $processId, status: $status) {...processInstanceFields}
  }
`

export const getStep = gql `
  ${stepFieldsFragment}
  query getStep($id: ID!) {
    step(id: $id) {...stepFields}
  }
`

export const createStepInstance = gql `
  ${stepInstanceFieldsFragment}
  mutation createStepInstance($stepId: ID!, $status: String!) {
    createStepInstance(stepId: $stepId, status: $status) {...stepInstanceFields}
  }
`

export const updateScreenshot = gql`
  mutation UpdateScreenshotBase64($base64: String!, $id: ID!, $stepId: ID!) {
    updateScreenshot(id: $id, base64: $base64, stepId: $stepId) {
      id
      base64
      stepId
      awsScreenshot
      awsProvisionalScreenshot
      awsDiffScreenshot
    }
  }
`

export const createScreenshot = gql `
  mutation CreateScreenshot($base64: String!, $stepId: ID!) {
    createScreenshot(base64: $base64, stepId: $stepId) { 
      id
      base64
      stepId
      awsScreenshot
      awsProvisionalScreenshot
      awsDiffScreenshot
    }
  }
`