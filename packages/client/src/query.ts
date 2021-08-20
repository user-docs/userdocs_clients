import {gql} from 'graphql-request'

export const getConfiguration = gql`  
query getUser($id: ID!) {
  user(id: $id) {
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

export const createProcessInstance = gql `
  mutation createProcessInstance($processId: ID!, $status: String!) {
    createProcessInstance(processId: $processId, status: $status) {
      id
      name
      order
      status
      stepInstances {
        id
        status
        step {
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
            version {
              id
              name
              project {
                id
                name
                baseUrl
              }
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
  mutation UpdateProcessInstance($id: ID!, $status: String!) {
    updateProcessInstance(id: $id, status: $status) {
      id
      status
    }
  }
`

export const createStepInstance = gql `
  mutation createStepInstance($stepId: ID!, $status: String!) {
    createStepInstance(stepId: $stepId, status: $status) {
      id
      status
      step {
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
          version {
            id
            name
            project {
              id
              name
              baseUrl
            }
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
    }
  }
`

export const getStep = gql `
  query getStep($id: ID!) {
    step(id: $id) {
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
  }
  `

  export const updateScreenshot = gql`
  mutation UpdateScreenshotBase64($base64: String!, $id: ID!, $stepId: ID!) {
    UpdateScreenshot(id: $id, base64: $base64, stepId: $stepId) {
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
  mutation CreateScreenshot($base64: String!, $stepId: Number!) {
    CreateScreenshot(base64: $base64, stepId: $stepId) { 
      id
      base64
      stepId
      awsScreenshot
      awsProvisionalScreenshot
      awsDiffScreenshot
    }
  }
`