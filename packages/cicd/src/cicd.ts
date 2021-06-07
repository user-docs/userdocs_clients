import * as Runner from '@userdocs/runner'
import * as Client from './client'
import * as Queries from './queries'
import * as Query from './query'  
import * as Mutations from './mutation'

export async function initialize(url, credentials, ) {
  const configuration = {
    automationFrameworkName: 'puppeteer',
    maxRetries: 3,
    environment: 'cicd',
    imagePath: '',
    userDataDirPath: '',
    callbacks: {
      step: {
        preExecutionCallbacks: [ 'startLastStepInstance' ],
        executionCallback: 'run',
        successCallbacks: [ 'completeLastStepInstance' ],
        failureCallbacks: [ 'failLastStepInstance' ]
      },
      process: {
        preExecutionCallbacks: [ 'startLastProcessInstance' ],
        executionCallback: 'run',
        successCallbacks: [ 'completeLastProcessInstance' ],
        failureCallbacks: [ 'failProcessInstance' ]
      },
      job: {
        preExecutionCallbacks: [ 'startLastJobInstance' ],
        executionCallback: 'run',
        successCallbacks: [ 'completeLastJobInstance' ],
        failureCallbacks: [ 'failLastJobInstance' ]
      }
    }
  }
  
  var runner = await Runner.initialize(configuration)
  runner = await Runner.openBrowser(runner)

  const tokens = await Client.authenticate(url + '/api/session', credentials)
  const client = await Client.create(url + '/api', tokens)

  return{ runner: runner, client: client }
}

export async function executeJob(cicd, jobId) {
  const queryText = Queries.job(jobId);
  const jobData = await Query.execute(cicd.client, queryText);
  const completedJob = await await Runner.executeJob(jobData.job, cicd.runner)
  const jobFields = Runner.allowedJobFields(completedJob);
  const result = await Query.execute(cicd.client, Mutations.UPDATE_JOB, jobFields);
  return result
}

export async function tearDown(cicd) {
  return Runner.closeBrowser(cicd.runner, cicd.runner.configuration)
}