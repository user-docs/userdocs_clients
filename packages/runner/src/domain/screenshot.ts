export interface Screenshot {
  id?: string
  name?: string,
  base64: string,
  order?: number,
  stepId: string
} 

export function allowedFields(screenshot: Screenshot) {
  return {
    id: screenshot.id,
    stepId: screenshot.stepId,
    base64: screenshot.base64
  }
}
/*
export const ALL_SCREENSHOT_FIELDS = gql`
  fragment AllScreenshotFields on Screenshot {
    id
    base64
    stepId
    awsScreenshot
    awsProvisionalScreenshot
    awsDiffScreenshot
  }
`

export const UPDATE_SCREENSHOT = gql`
  ${ALL_SCREENSHOT_FIELDS}
  mutation UpdateScreenshotBase64($base64: String!, $id: ID!, $stepId: ID!) {
    UpdateScreenshot(id: $id, base64: $base64, stepId: $stepId) {
      ...AllScreenshotFields
    }
  }
`
export const CREATE_SCREENSHOT = gql `
${ALL_SCREENSHOT_FIELDS}
  mutation CreateScreenshot($base64: String!, $stepId: Number!) {
    CreateScreenshot(base64: $base64, stepId: $stepId) { 
      ...AllScreenshotFields
    }
  }
`

export const DELETE_SCREENSHOT = gql `
  mutation DeleteScreenshot($id: ID!) { 
    DeleteScreenshot(id: $id) {
      id
    }
  }
`
*/