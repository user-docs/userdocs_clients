import { v4 as uuidv4 } from 'uuid';
import * as ProcessInstance from './processInstance'
import * as Step from './step'
import { Runner, Configuration } from '../runner/runner'
export interface Process {
  id: string,
  order: number,
  name: string,
  type: string,
  lastProcessInstance: ProcessInstance.ProcessInstance,
  steps: Array<Step.Step>
}

export async function execute(process: Process, runner: Runner, configuration: Configuration) {
  console.group(`Starting execution of process ${process.id}, ${process.name}.`)
  console.time("Process Timer")
  try {
    // process = await runner.callbacks.process.executionCallback(process, runner)
    console.debug(`Execution of process ${process.id}, ${process.name} completed successfully`)
  } catch(error) {
    console.log("Caught Process Error")
    console.debug(`Execution of process ${process.id}, ${process.name} failed because ${error}`)
    console.debug(error.stack)
  }
  console.timeEnd("Process Timer")
  console.groupEnd();
  return process
}

export const handlers = {
  embedNewProcessInstance: async(process: Process) => {
    console.log("embedNewProcessInstance")
    const processInstance: ProcessInstance.ProcessInstance = {
      uuid: uuidv4(),
      order: process.order,
      status: "started", //TODO: Implement additional execution callbacks
      name: process.name,
      type: "stepInstance",
      processId: process.id,
      startedAt: new Date()
    }
    if (process.lastProcessInstance) console.warn("Last Process Instance already exists, will not replace it.")
    else process.lastProcessInstance = processInstance
    return process
  },
  startLastProcessInstance: async(process: Process, runner: Runner) => {
    process.lastProcessInstance.status = 'started'
    return process
  },
  run: async(process: Process, runner: Runner) => {  
    for(var step of process.steps) {
      //step = await Step.execute(step, runner)
      if (process.lastProcessInstance.id) step.lastStepInstance.processInstanceId = process.lastProcessInstance.id
      if (step.lastStepInstance.status == 'failed') throw new Error(`Step ${step.id}, ${step.name} failed to execute`)
    }
    return process
  },
  completeLastProcessInstance: async(process: Process) => {
    process.lastProcessInstance.status = 'complete'
    process.lastProcessInstance.finishedAt = new Date()
    return process
  },
  failProcessInstance: async (process: Process, runner: Runner, error: Error) => {
    process.lastProcessInstance.status = 'failed'
    if (Array.isArray(process.lastProcessInstance.errors) == true) process.lastProcessInstance.errors.push(error)
    else process.lastProcessInstance.errors = [ error ]
    return process
  },
  nothing: async (process: Process) => { return process },
  fail: async (process: Process) => { throw new Error("This process is expected to fail for test purposes") }
}

export function allowedFields(process: Process) {
  var steps = []
  for(const step of process.steps ? process.steps : []) {
    steps.push(Step.allowedFields(step))
  } 
  var fields: any = {
    id: process.id,
    steps: steps
  }
  if (process.lastProcessInstance) {
    fields.lastProcessInstance = ProcessInstance.allowedFields(process.lastProcessInstance)
  }
  return fields
}