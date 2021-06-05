import { gql } from 'graphql-request'

export function job(jobId: number) {
  return gql`
    ${warningsFragment()} 
    ${errorsFragment()}
    ${jobProcessFragment()}
    ${jobStepsFragment()}
    ${jobInstanceFragment()}
    {job(id: ${jobId}) { 
      id
      name
      warnings { ...AllWarningFields }
      errors { ...AllErrorFields }
      jobProcesses { ...JobProcessFields }
      jobSteps { ...JobStepsFields }
      lastJobInstance { ...JobInstanceFields }
    }}
  `
}

function jobProcessFragment() {
  return gql `
    ${processInstanceFragment()}
    ${processFragment()}
    fragment JobProcessFields on JobProcess {
      id
      processInstance { ...ProcessInstanceFields }
      process { ...ProcessFields }
    }
  `
}

function jobInstanceFragment() {
  return gql `
    fragment JobInstanceFields on JobInstance {
      id
      name
      status
      warnings { ...AllWarningFields }
      errors { ...AllErrorFields }
    }
  `
}

function processInstanceFragment() {
  return gql `
    ${stepInstanceFragment()}
    fragment ProcessInstanceFields on ProcessInstance {
      id
      order
      name
      status
      type
      warnings { ...AllWarningFields }
      errors { ...AllErrorFields }
      stepInstances { ...StepInstanceFields }
    }
  `
}

function processFragment() {
  return gql `
    ${processInstanceFragment()}
    ${stepFragment()}
    fragment ProcessFields on Process {
      id
      name
      lastProcessInstance { ...ProcessInstanceFields}
      steps { ...StepFields }
    }
  `
}

function jobStepsFragment() {
  return gql `
    fragment JobStepsFields on JobStep {
      id
    }
  `
}



function stepInstanceFragment() {
  return gql`
    fragment StepInstanceFields on StepInstance {
      id
      order
      status
      name
      type
      warnings { ...AllWarningFields }
      errors { ...AllErrorFields }
      stepId
    }
  `
}

function stepFragment() {
  return gql `
    ${stepInstanceFragment()}
    fragment StepFields on Step {
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
      lastStepInstance { ...StepInstanceFields }
    }
  `
}



export function stepInstance(step_instance_id: number) {
  return gql`
  {stepInstance(id: ${step_instance_id}) {
    name
    id
    order
    step {
      id
      name
      annotation {
        id
        name
      }
      page {
        id
        name
      }
      stepType {
        id
        name
      }
      element {
        id
        name
        strategy {
          id
          name
        }
      }
      screenshot {
        id
        name
      }
    }
  }}`
}

function warningsFragment() {
  return gql`
  fragment AllWarningFields on Warning {
    name
    message
    stack
  }`
}

function errorsFragment() {
  return gql`
  fragment AllErrorFields on Error {
    name
    message
    stack
  }`
}