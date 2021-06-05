interface Job {
  order: number,
  status: string,
  name: string,
  processInstances: Array<ProcessInstance>,
  stepInstances: Array<StepInstance>
}

interface ProcessInstance {
  order: number,
  status: string,
  name: string,
  type: string,
  stepInstances: Array<StepInstance>
}

interface StepInstance {
  order: number,
  status: string,
  name: string,
  type: string
}

export function getCurrentStepInstance(job: Job) {
  for(const item of getExecutableItems(job)) {
    if (item.type == "step_instance") { 
      const stepInstance = item as StepInstance
      if (stepInstance.status != 'complete') return item
    } else if (item.type == "process_instance") {
      const processInstance = item as ProcessInstance
      for (const stepInstance of processInstance.stepInstances) {
        if (stepInstance.status != 'complete') {
          return stepInstance
        }
      }
    }
  }
  return null
}

export function getExecutableItems(job: Job) {
  return ([] as Array<ProcessInstance | StepInstance>)
    .concat(job.processInstances, job.stepInstances)
    .sort(function(a, b) { return a.order - b.order })
}