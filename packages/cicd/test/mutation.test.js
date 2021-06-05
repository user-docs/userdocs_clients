const { authenticate } = require('../lib/auth')
const Job = require('../../runner/lib/domain/job')
const ProcessInstance = require('../../runner/lib/domain/processInstance')
const StepInstance = require('../../runner/lib/domain/stepInstance')
const { CREATE_SCREENSHOT, UPDATE_SCREENSHOT, DELETE_SCREENSHOT } = require('../../runner/lib/domain/screenshot')
const { query } = require('../lib/query')
const stepInstanceData = require('../../runner/test/testFullScreenScreenshotStep.json')
const jobData = require('../../runner/test/testJob.json')
require('dotenv').config()

const auth_url = 'https://' + process.env.DEV_HOST + ':' + process.env.DEV_PORT  + '/api/session'
const api_url = 'https://' + process.env.DEV_HOST + ':' + process.env.DEV_PORT  + '/api'
const auth_params = { authUrl: auth_url, email: 'johns10davenport@gmail.com', password: 'userdocs'}
const singleWhitePixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
const singleBlackPixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAANSURBVBhXY8jPz/8PAATrAk3xWKD8AAAAAElFTkSuQmCC"
var tokens = null
var screenshotId = null
const stepId = 17

beforeAll( async () => {
  tokens = await authenticate(auth_params)
});

const expectStepInstance = expect.objectContaining({ 
  id: expect.any(String),
  status: expect.any(String),
  step: expect.objectContaining({ 
    id: expect.any(String) }) })

const expectProcessInstance = expect.objectContaining({ 
  id: expect.any(String),
  status: expect.any(String),
  stepInstances: expect.arrayContaining(
    [ expectStepInstance ] ) })

const expectJob = expect.objectContaining({
  id: expect.any(String) })

test('it properly filters the fields from a stepInstance', async () => {
  filteredStepInstance = StepInstance.allowedFields(stepInstanceData)
  expect(filteredStepInstance).toStrictEqual(
    expect.objectContaining({ 
      id: expect.any(String),
      status: expect.any(String),
      step: expect.objectContaining({ 
        screenshot: expect.objectContaining({ 
          id: expect.any(String) }) }) }) )
})

test('it properly filters the fields from a processInstance', async () => {
  processInstance = jobData.job.processInstances[0]
  filteredProcessInstance = ProcessInstance.allowedFields(processInstance)
  expect(filteredProcessInstance).toStrictEqual(expectProcessInstance)
})

test ('it properly filters the fields from a job', async () => {
  filteredJob = Job.allowedFields(jobData.job)
  expect(filteredJob).toStrictEqual(expectJob)
})

test('it creates a screenshot', async () => {
  const variables = { stepId: stepId, base64: singleWhitePixel }
  response = await query.execute(api_url, tokens, CREATE_SCREENSHOT, variables);
  expect(response).toStrictEqual(
    expect.objectContaining({
      CreateScreenshot: expect.objectContaining({ 
        awsScreenshot: expect.stringContaining(".png"),
        id: expect.any(String) }) }) )
  screenshotId = response.CreateScreenshot.id
})

test('it updates a screenshot', async () => {
  const variables = { id: screenshotId, stepId: stepId, base64: singleBlackPixel }
  response = await query.execute(api_url, tokens, UPDATE_SCREENSHOT, variables);
  expect(response).toStrictEqual(
    expect.objectContaining({
      UpdateScreenshot: expect.objectContaining({ 
        awsScreenshot: expect.stringContaining(".png"),
        awsProvisionalScreenshot: expect.stringContaining(".png"),
        awsDiffScreenshot: expect.stringContaining(".png"),
        id: expect.any(String) }) }) )
})

test('it deletes a screenshot', async () => {
  response = await query.execute(api_url, tokens, DELETE_SCREENSHOT, { id: screenshotId });
  expect(response).toStrictEqual(
    expect.objectContaining({
      DeleteScreenshot: expect.objectContaining({ 
        id: expect.stringMatching(screenshotId) }) }) )
})
/*
test('it updates a step instance with no screenshot', async () => {
  const variables = { id: 9, status: "complete", step: { id: 17, order: 50, screenshot: { stepId: 17, base64: singleBlackPixel } } }
  response = await query.execute(api_url, tokens, StepInstance.UPDATE_STEP_INSTANCE, variables);
  expect(response).toStrictEqual(
    expect.objectContaining({
      updateStepInstance: expect.objectContaining({ 
        step: expect.objectContaining({ 
          screenshot: expect.objectContaining({ 
            id: expect.any(String) }) }) }) }) )
  screenshotId = response.updateStepInstance.step.screenshot.id
})

test('it updates a step instance with a screenshot', async() => {
  const variables = { id: 9, status: "complete", step: { id: 17, order: 50, screenshot: { id: screenshotId, stepId: 17, base64: singleWhitePixel } } }
  response = await query.execute(api_url, tokens, StepInstance.UPDATE_STEP_INSTANCE, variables);
  expect(response).toStrictEqual(
    expect.objectContaining({
      updateStepInstance: expect.objectContaining({ 
        step: expect.objectContaining({ 
          screenshot: expect.objectContaining({ 
            id: screenshotId }) }) }) }) )
})

test('not really a test, just deleting the screenshot', async() => {
  response = await query.execute(api_url, tokens, DELETE_SCREENSHOT, { id: screenshotId });
})

test('it updates a process instance with a bunch of steps', async() => {
  status = 'not_started'
  processInstance = jobData.job.processInstances[0]
  for(stepInstance of processInstance.stepInstances) {
    stepInstance.status = status
  }
  processInstance.status = status
  variables = ProcessInstance.allowedFields(processInstance)
  queryText = ProcessInstance.UPDATE_PROCESS_INSTANCE
  response = await query.execute(api_url, tokens, queryText, variables);
})


test('it updates a job with a process', async() => {
  status = 'not_started'
  for(processInstance of jobData.job.processInstances) {
    for(stepInstance of processInstance.stepInstances) {
      stepInstance.status = status
    }
    processInstance.status = status
  }
  jobData.job.status = status
  variables = Job.allowedFields(jobData.job)
  queryText = Job.UPDATE_JOB
  response = await query.execute(api_url, tokens, queryText, variables);
})
*/