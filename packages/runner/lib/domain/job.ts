import { v4 as uuidv4 } from 'uuid';

import * as Step from './step'
import * as Process from './process'
import * as JobStep from './jobStep'
import * as JobProcess from './jobProcess'
import * as JobInstance from './jobInstance'
import { Runner } from '../runner/runner'

export interface Job {
  id: string,
  order: number,
  status: string,
  name: string,
  errors: Array<Error>,
  lastJobInstance: JobInstance.JobInstance,
  jobSteps: Array<JobStep.JobStep>,
  jobProcesses: Array<JobProcess.JobProcess>
}

export async function execute(job: Job, runner: Runner)  {
  console.group(`Starting execution of job ${job.id}`)
  console.time("Job Timer")
  for(const callback of runner.callbacks.job.preExecutionCallbacks) { 
    job = await callback(job, runner) 
  }
  try {
    job = await runner.callbacks.job.executionCallback(job, runner)
    for(const callback of runner.callbacks.job.successCallbacks) { 
      job = await callback(job, runner) 
    }
    console.debug(`Execution of job ${job.id} completed successfully`)
  } catch(error) {
    for(const callback of runner.callbacks.job.failureCallbacks) { 
      job = await callback(job, runner, error) 
    }
    console.debug(`Execution of job ${job.id} failed because ${error}`)
    console.debug(error.stack)
  }
  console.timeEnd("Job Timer")
  console.groupEnd();
  return job
}

export const handlers = {
  embedNewJobInstance: async(job: Job) => {
    const jobInstance: JobInstance.JobInstance = {
      uuid: uuidv4(),
      status: "not_started",
      name: job.name,
      jobId: job.id
    }
    job.lastJobInstance = jobInstance
    return job
  },
  startLastJobInstance: async(job: Job, runner: Runner) => {
    job.lastJobInstance.status = 'started'
    return job
  },
  run: async(job: Job, runner: Runner) => {
    var executableItems = getExecutableItems(job)
    for (var item of executableItems) {
      if(item.type == 'jobProcess') {
        var process = (item as JobProcess.JobProcess).process
        process = await Process.execute(process, runner)
      }
      else if(item.type == 'jobStep') {
        var step = (item as JobStep.JobStep).step
        step = await Step.execute(step, runner)
      } else {
        throw new Error("Item not executed because it is not of type jobProcess or jobStep")
      }
    }
    return job
  },
  completeLastJobInstance: async(job: Job) => {
    job.lastJobInstance.status = 'complete'
    job.lastJobInstance.finishedAt = new Date()
    return job
  },
  failLastJobInstance: async (job: Job, runner: Runner, error: Error) => {
    job.lastJobInstance.status = 'failed'
    if (Array.isArray(job.lastJobInstance.errors) == true) job.lastJobInstance.errors.push(error)
    else job.lastJobInstance.errors = [ error ]
    return job
  },
  nothing: async (job: Job) => { return job },
  fail: async (job: Job) => { throw new Error("This process is expected to fail for test purposes" )}
}

export function allowedFields(job: Job) {
  var jobSteps = []
  for(const jobStep of job.jobSteps ? job.jobSteps : []) {
    jobSteps.push(JobStep.allowedFields(jobStep))
  } 
  var jobProcesses = []
  for(const jobProcess of job.jobProcesses ? job.jobProcesses: []) {
    jobProcesses.push(JobProcess.allowedFields(jobProcess))
  } 
  return {
    id: job.id,
    jobSteps:  jobSteps,
    jobProcesses: jobProcesses,
    lastJobInstance: JobInstance.allowedFields(job.lastJobInstance)
  }
}

function getExecutableItems(job: Job) {
  for (const jobProcess of job.jobProcesses) jobProcess.type = 'jobProcess'
  for (const step of job.jobSteps) step.type = 'jobStep'
  var result: Array<JobStep.JobStep | JobProcess.JobProcess> = []
  return result
    .concat(job.jobProcesses, job.jobSteps)
    .sort(function(a, b) { return a.order - b.order })
}
