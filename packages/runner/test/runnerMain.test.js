const Runner = require('../lib/runner/runner')
const StepFixtures = require('./fixtures/step.js')

/*
beforeAll( async () => { browser = await Puppet.openBrowser({}); });
afterAll( async () => { await Puppet.closeBrowser(browser, {}); });
const auth_url = 'https://dev.user-docs.com:4002/api/session'
const api_url = 'https://dev.user-docs.com:4002/api'
const auth_params = { authUrl: auth_url, email: 'johns10davenport@gmail.com', password: 'userdocs'}
*/

const before = async (step) => { 
  step.hello = "world" 
  await new Promise(resolve => setTimeout(resolve, 10));
  return step
}
const beforeTwo = async (step) => { 
  step.helloTwo = "world" 
  await new Promise(resolve => setTimeout(resolve, 10));
  return step
}
const after = async (step) => { 
  step.goodbye = "world"
  await new Promise(resolve => setTimeout(resolve, 10));
  return step
}
const afterTwo = async (step) => { 
  step.goodbyeTwo = "world"
  await new Promise(resolve => setTimeout(resolve, 10));
  return step
}
var runner
const configuration = {
  automationFrameworkName: 'puppeteer',
  imagePath: './images',
  userDataDirPath: './user_data_dir',
  maxRetries: 3,
  environment: 'development',
  imagePath: './images',
  callbacks: {
    step: {
      preExecutionCallbacks: [ before, beforeTwo ],
      executionCallback: 'run',
      successCallbacks: [  after, afterTwo ]
    },
    process: {
      preExecutionCallbacks: [ before, beforeTwo ],
      executionCallback: 'nothing',
      successCallbacks: [  after, afterTwo ]
    },
    job: {
      preExecutionCallbacks: [ before, beforeTwo ],
      executionCallback: 'nothing',
      successCallbacks: [  after, afterTwo ]
    }
  }
}


test('initialize passes back a properly initialized runner', () => {
  runner = Runner.initialize(configuration)
  expect(runner).toStrictEqual(
    expect.objectContaining({
      automationFramework: expect.objectContaining({
        stepHandler: expect.any( Function ),
        openBrowser: expect.any( Function ),
        closeBrowser: expect.any( Function ),
      }),
      callbacks: expect.objectContaining({
        step: expect.objectContaining({
          preExecutionCallbacks: expect.arrayContaining([ before, beforeTwo ]),
          successCallbacks: expect.arrayContaining([ after, afterTwo ])
        })
      })
    })
  )
})

test('openBrowser opens a browser on an initialized runner', async () => {
  runner = await Runner.openBrowser(runner, configuration)
  expect(runner.automationFramework.browser.constructor.name).toStrictEqual('Browser')
})

test('executeStep does the things', async () => {
  const addRemoveUrl = 'https://the-internet.herokuapp.com/add_remove_elements/'
  const step = { id: 1, name: "Navigate to add remove url", page: { url: addRemoveUrl }, stepType: { name: 'Navigate' } }
  completedStep = await Runner.executeStep(step, runner)
  const page = (await runner.automationFramework.browser.pages())[0]
  expect(page.url()).toBe(addRemoveUrl)
  expect(completedStep).toStrictEqual(
    expect.objectContaining({
      hello: "world",
      helloTwo: "world",
      goodbye: "world",
      goodbyeTwo: "world"
    })
  )
})

test('embedNewStepInstance adds the args to the step', async () => {
  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'embedNewStepInstance' ],
    executionCallback: 'nothing',
    successCallbacks: [ ]
  }
  Runner.configureCallbacks(runner, configuration)
  const step = { id: 1, name: "Navigate to add remove url", page: { url: 'https://google.com' }, stepType: { name: 'Navigate' } }
  completedStep = await Runner.executeStep(step, runner)
  expect(completedStep).toStrictEqual(
    expect.objectContaining({
      lastStepInstance: expect.objectContaining({
        status: expect.stringContaining('started'),
        name: expect.stringContaining(step.name) }) }) )
})

test('startLastStepInstance astarts the existing last step instance', async () => {
  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'startLastStepInstance' ],
    executionCallback: 'nothing',
    successCallbacks: [ ]
  }
  Runner.configureCallbacks(runner, configuration)
  const step = { id: 1, name: "Navigate to add remove url", page: { url: 'https://google.com' }, stepType: { name: 'Navigate' }, lastStepInstance: { id: 1, stepId: 1, status: 'not_started'} }
  completedStep = await Runner.executeStep(step, runner)
  expect(completedStep).toStrictEqual(
    expect.objectContaining({
      lastStepInstance: expect.objectContaining({
        status: expect.stringContaining('started') }) }) )
})

test('completeStepInstance completes the step instance', async () => {
  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'embedNewStepInstance' ],
    executionCallback: 'nothing',
    successCallbacks: [ 'completeStepInstance' ]
  }
  Runner.configureCallbacks(runner, configuration)
  const step = { id: 1, name: "Navigate to add remove url", page: { url: 'https://google.com' }, stepType: { name: 'Navigate' } }
  completedStep = await Runner.executeStep(step, runner)
  expect(completedStep).toStrictEqual(
    expect.objectContaining({
      lastStepInstance: expect.objectContaining({
        status: expect.stringContaining('complete'),
        name: expect.stringContaining(step.name) }) }) )
})

test('failLastStepInstance fails the last step instance', async () => {
  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'startLastStepInstance' ],
    executionCallback: 'fail',
    failureCallbacks: [ 'failLastStepInstance' ]
  }
  Runner.configureCallbacks(runner, configuration)
  const step = { id: 1, name: "Navigate to add remove url", page: { url: 'https://google.com' }, stepType: { name: 'Navigate' }, lastStepInstance: { id: 1, stepId: 1, status: 'not_started'} }
  completedStep = await Runner.executeStep(step, runner)
  expect(completedStep).toStrictEqual(
    expect.objectContaining({
      lastStepInstance: expect.objectContaining({
        status: expect.stringContaining('failed'),
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'This step is expected to fail for test purposes'
          })
        ])
      }) 
    }) 
  )
})

test('failing step instances return with errors attached', async () => {
  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'embedNewStepInstance' ],
    executionCallback: 'fail',
    failureCallbacks: [ 'failStepInstance' ]
  }
  Runner.configureCallbacks(runner, configuration)
  const step = { id: 1, name: "Navigate to add remove url", page: { url: 'https://google.com' }, stepType: { name: 'Navigate' } }
  completedStep = await Runner.executeStep(step, runner)
  console.log(completedStep)
  expect(completedStep).toStrictEqual(
    expect.objectContaining({
      lastStepInstance: expect.objectContaining({
        status: expect.stringContaining('failed'),
        name: expect.stringContaining(step.name),
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('This step is expected to fail for test purposes') }) ]) }) }) )
})

test('executeProcess executes its pre-execution hooks', async () => {
  const process = {
    name: "process", id: 1, steps: [
      { id: 1, name: "Navigate to add remove url", page: { url: 'https://the-internet.herokuapp.com/add_remove_elements/' }, stepType: { name: 'Navigate' } },
      { stepType: { name: 'Click' }, element: { selector: "//button[contains(., 'Add Element')]", strategy: { name: 'xpath' }} } ] }
  
  configuration.callbacks.process = {
    preExecutionCallbacks: [ 'embedNewProcessInstance' ],
    executionCallback: 'nothing',
    successCallbacks: [ ]
  }
  runner = Runner.configureCallbacks(runner, configuration)
  completedProcess = await Runner.executeProcess(process, runner)
  expect(completedProcess).toStrictEqual(
    expect.objectContaining({
      lastProcessInstance: expect.objectContaining({
        status: expect.stringContaining('started'),
        name: expect.stringContaining(process.name) }) }) )
})

test('executeProcess executes its execution hooks', async () => {
  const process = {
    name: "process", id: 1, steps: [
      { id: 1, name: "Navigate to add remove url", page: { url: 'https://the-internet.herokuapp.com/add_remove_elements/' }, stepType: { name: 'Navigate' } },
      { id: 2, name: "Click add element", stepType: { name: 'Click' }, element: { selector: "//button[contains(., 'Add Element')]", strategy: { name: 'xpath' }} } 
    ] 
  }
  
  configuration.callbacks.process = {
    preExecutionCallbacks: [ 'embedNewProcessInstance' ],
    executionCallback: 'run',
    successCallbacks: [ ]
  }

  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'embedNewStepInstance' ],
    executionCallback: 'run',
    successCallbacks: [ ]
  }

  runner = Runner.configureCallbacks(runner, configuration)
  completedProcess = await Runner.executeProcess(process, runner)

  const page = (await runner.automationFramework.browser.pages())[0]
  const handle = (await page.$x("//button[contains(., 'Delete')]"))[0]
  expect(handle).toEqual(expect.any(Object))
  expect(completedProcess).toStrictEqual(
    expect.objectContaining({
      lastProcessInstance: expect.objectContaining({
        status: expect.stringContaining('started'),
        name: expect.stringContaining(process.name) }) }) )
})

test('executeProcess fails correctly for a planned failure', async () => {
  navigateStep = { id: "1", name: "Navigate to add remove url", page: { url: 'https://the-internet.herokuapp.com/add_remove_elements/' }, stepType: { name: 'Navigate' } }
  clickStep = { id: "2", name: "Click add element", stepType: { name: 'Click' }, element: { selector: "//button[contains(., 'Add Element')]", strategy: { name: 'xpath' }} }
  const process = { name: "process", id: "1", steps: [ navigateStep, clickStep] }
  
  configuration.callbacks.process = {
    preExecutionCallbacks: [ 'embedNewProcessInstance' ],
    executionCallback: 'run',
    failureCallbacks: [ 'failProcessInstance' ]
  }

  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'embedNewStepInstance' ],
    executionCallback: 'fail',
    failureCallbacks: [ 'failStepInstance' ]
  }

  runner = Runner.configureCallbacks(runner, configuration)
  completedProcess = await Runner.executeProcess(process, runner)
  expect(completedProcess).toStrictEqual(
    expect.objectContaining({
      lastProcessInstance: expect.objectContaining({
        status: expect.stringContaining('failed'),
        name: expect.stringContaining(process.name),
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Step 1, Navigate to add remove url failed to execute'
          })
        ])
      }),
      steps: expect.arrayContaining([
        expect.objectContaining({
          id: expect.stringContaining(navigateStep.id),
          name: expect.stringContaining(navigateStep.name),
          lastStepInstance: expect.objectContaining({
            status: expect.stringContaining('failed'),
            name: expect.stringContaining(navigateStep.name),
            errors: expect.arrayContaining([
              expect.objectContaining({
                message: 'This step is expected to fail for test purposes'
              })
            ])
          })
        })
      ])
    }) 
  )
})

test('executeProcess fails correctly for a legitimate failure', async () => {
  navigateStep = { id: "1", name: "Navigate to add remove url", page: { url: 'https://the-internet.herokuapp.com/add_remove_elements/' }, stepType: { name: 'Navigate' } }
  clickStep = { id: "2", name: "Click add element", stepType: { name: 'Click' }, element: { selector: "//button[contains(., 'Your mom's face')]", strategy: { name: 'xpath' }} }
  const process = { name: "process", id: "1", steps: [ navigateStep, clickStep] }
  
  configuration.callbacks.process = {
    preExecutionCallbacks: [ 'embedNewProcessInstance' ],
    executionCallback: 'run',
    successCallbacks: [ 'completeLastProcessInstance' ],
    failureCallbacks: [ 'failProcessInstance' ]
  }

  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'embedNewStepInstance' ],
    executionCallback: 'run',
    successCallbacks: [ 'completeStepInstance' ],
    failureCallbacks: [ 'failStepInstance' ]
  }

  runner = Runner.configureCallbacks(runner, configuration)
  completedProcess = await Runner.executeProcess(process, runner)
  expect(completedProcess).toStrictEqual(
    expect.objectContaining({
      lastProcessInstance: expect.objectContaining({
        status: expect.stringContaining('failed'),
        name: expect.stringContaining(process.name),
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Step 2, Click add element failed to execute'
          })
        ])
      }),
      steps: expect.arrayContaining([
        expect.objectContaining({
          id: expect.stringContaining(navigateStep.id),
          name: expect.stringContaining(navigateStep.name),
          lastStepInstance: expect.objectContaining({
            status: expect.stringContaining('complete'),
            name: expect.stringContaining(navigateStep.name)
          })
        }),
        expect.objectContaining({
          id: expect.stringContaining(clickStep.id),
          name: expect.stringContaining(clickStep.name),
          lastStepInstance: expect.objectContaining({
            status: expect.stringContaining('failed'),
            name: expect.stringContaining(clickStep.name)
          })
        })
      ])
    }) 
  )
})

test('executeProcess succeeds', async () => {
  navigateStep = { id: "1", name: "Navigate to add remove url", page: { url: 'https://the-internet.herokuapp.com/add_remove_elements/' }, stepType: { name: 'Navigate' } }
  clickStep = { id: "2", name: "Click add element", stepType: { name: 'Click' }, element: { selector: "//button[contains(., 'Add Element')]", strategy: { name: 'xpath' }} }
  const process = { name: "process", id: "1", steps: [ navigateStep, clickStep] }
  
  configuration.callbacks.process = {
    preExecutionCallbacks: [ 'embedNewProcessInstance' ],
    executionCallback: 'run',
    successCallbacks: [ 'completeLastProcessInstance' ],
    failureCallbacks: [ 'failProcessInstance' ]
  }

  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'embedNewStepInstance' ],
    executionCallback: 'run',
    successCallbacks: [ 'completeStepInstance' ],
    failureCallbacks: [ 'failStepInstance' ]
  }

  runner = Runner.configureCallbacks(runner, configuration)
  completedProcess = await Runner.executeProcess(process, runner)
  expect(completedProcess).toStrictEqual(
    expect.objectContaining({
      lastProcessInstance: expect.objectContaining({
        status: expect.stringContaining('complete'),
        name: expect.stringContaining(process.name)
      }),
      steps: expect.arrayContaining([
        expect.objectContaining({
          id: expect.stringContaining(navigateStep.id),
          name: expect.stringContaining(navigateStep.name),
          lastStepInstance: expect.objectContaining({
            status: expect.stringContaining('complete'),
            name: expect.stringContaining(navigateStep.name)
          })
        }),
        expect.objectContaining({
          id: expect.stringContaining(clickStep.id),
          name: expect.stringContaining(clickStep.name),
          lastStepInstance: expect.objectContaining({
            status: expect.stringContaining('complete'),
            name: expect.stringContaining(clickStep.name)
          })
        })
      ])
    }) 
  )
})

test('createJobInstance adds the args to the step', async() => {
  thisJob = { id: 1, order: 1, status: 'not_started', name: 'test job', steps: [ ], processes: [ ]}
  configuration.callbacks.job = {
    preExecutionCallbacks: [ 'embedNewJobInstance' ],
    executionCallback: 'nothing',
    successCallbacks: [ ],
    failureCallbacks: [ ]
  }
  
  runner = Runner.configureCallbacks(runner, configuration)
  completedJob = await Runner.executeJob(thisJob, runner)

  expect(completedJob).toStrictEqual(
    expect.objectContaining({
      lastJobInstance: expect.objectContaining({
        status: expect.stringContaining('not_started'),
        name: expect.stringContaining(thisJob.name) }) }) )
})

test('completeJob completes the job instance', async () => {
  thisJob = { id: 1, order: 1, status: 'not_started', name: 'test job', steps: [ ], processes: [ ]}
  configuration.callbacks.job = {
    preExecutionCallbacks: [ 'embedNewJobInstance' ],
    executionCallback: 'nothing',
    successCallbacks: [ 'completeLastJobInstance' ]
  }
  Runner.configureCallbacks(runner, configuration)
  completedJob = await Runner.executeJob(thisJob, runner)
  expect(completedJob).toStrictEqual(
    expect.objectContaining({
      lastJobInstance: expect.objectContaining({
        status: expect.stringContaining('complete'),
        name: expect.stringContaining(thisJob.name) }) }) )
})

test('failing step instances return with errors attached', async () => {
  thisJob = { id: 1, order: 1, status: 'not_started', name: 'test job', steps: [ ], processes: [ ]}
  configuration.callbacks.job = {
    preExecutionCallbacks: [ 'embedNewJobInstance' ],
    executionCallback: 'fail',
    failureCallbacks: [ 'failLastJobInstance' ]
  }
  Runner.configureCallbacks(runner, configuration)
  completedJob = await Runner.executeJob(thisJob, runner)
  expect(completedJob).toStrictEqual(
    expect.objectContaining({
      lastJobInstance: expect.objectContaining({
        status: expect.stringContaining('failed'),
        name: expect.stringContaining(thisJob.name) }) }) )
})

test('job execution executes', async () => {
  url = 'https://the-internet.herokuapp.com/add_remove_elements/'
  selector = "//button[contains(., 'Add Element')]"
  resultingSelector = "//button[contains(., 'Delete')]"
  thisJob = {
    id: 1,
    order: 1,
    status: 'not_started',
    name: 'test job',
    jobSteps: [ 
      { id: "1", order: 1, step: StepFixtures.navigate.step(url) },
      { id: "2", order: 2, step: StepFixtures.click.step(selector) },
      { id: "3", order: 3, step: StepFixtures.click.step(selector) },
    ],
    jobProcesses: [
      { id: "1", order: 4, process: {
          id: "1", name: "process",  steps: [
            StepFixtures.click.step(selector),
            StepFixtures.click.step(selector),
            StepFixtures.click.step(selector),
            StepFixtures.click.step(selector),
          ] 
        }
      }
    ]
  }
  configuration.callbacks.process = {
    preExecutionCallbacks: [ 'embedNewProcessInstance' ],
    executionCallback: 'run',
    successCallbacks: [ 'completeLastProcessInstance' ],
    failureCallbacks: [ 'failProcessInstance' ]
  }

  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'embedNewStepInstance' ],
    executionCallback: 'run',
    successCallbacks: [ 'completeLastStepInstance' ],
    failureCallbacks: [ 'failStepInstance' ]
  }

  configuration.callbacks.job = {
    preExecutionCallbacks: [ 'embedNewJobInstance' ],
    executionCallback: 'run',
    failureCallbacks: [ 'failLastJobInstance' ],
    successCallbacks: [ 'completeLastJobInstance' ]
  }
  runner = Runner.configureCallbacks(runner, configuration)
  completedJob = await Runner.executeJob(thisJob, runner)
  const page = (await runner.automationFramework.browser.pages())[0]
  const handles = await page.$x(resultingSelector)
  expect(handles.length).toStrictEqual(6)
  expect(completedJob).toStrictEqual(
    expect.objectContaining({
      lastJobInstance: expect.objectContaining({ status: expect.stringContaining('complete') }), 
      jobSteps: expect.arrayContaining([
        expect.objectContaining({ 
          id: '1',
          order: 1,
          step: expect.objectContaining({ 
            lastStepInstance: expect.objectContaining({
              status: expect.stringContaining('complete')
            })
          })
        }),
        expect.objectContaining({
          id: '2',
          order: 2,
          step: expect.objectContaining({ 
            lastStepInstance: expect.objectContaining({
              status: expect.stringContaining('complete')
            })
          })
        }),
        expect.objectContaining({
          id: '3',
          order: 3,
          step: expect.objectContaining({ 
            lastStepInstance: expect.objectContaining({
              status: expect.stringContaining('complete')
            })
          })
        })
      ]),
      jobProcesses: expect.arrayContaining([
        expect.objectContaining({ 
          id: '1',
          order: 4,
          process: expect.objectContaining({ 
            id: '1',
            lastProcessInstance: expect.objectContaining({
              status: expect.stringContaining('complete')
            }),
            steps: expect.arrayContaining([ 
              expect.objectContaining({
                lastStepInstance: expect.objectContaining({
                  status: expect.stringContaining('complete')
                }),
                lastStepInstance: expect.objectContaining({
                  status: expect.stringContaining('complete')
                }),
                lastStepInstance: expect.objectContaining({
                  status: expect.stringContaining('complete')
                }),
                lastStepInstance: expect.objectContaining({
                  status: expect.stringContaining('complete')
                })
              })
            ])
          })
        })
      ])
    }) 
  )
})

test('failing annotation application return with errors attached', async () => {
  const step = { 
    name: "Failing Step",
    element: { selector: "//button[contains(., 'Add Element')]", strategy: { name: 'xpath' }}, 
    stepType: { name: 'Apply Annotation' },
    annotation: { annotationType: { name: 'Throw' } }
  }

  configuration.callbacks.step = {
    preExecutionCallbacks: [ 'embedNewStepInstance' ],
    executionCallback: 'fail',
    failureCallbacks: [ 'failLastStepInstance' ]
  }

  Runner.configureCallbacks(runner, configuration)
  completedStep = await Runner.executeStep(step, runner)
  console.log(completedStep)
  expect(completedStep).toStrictEqual(
    expect.objectContaining({
      lastStepInstance: expect.objectContaining({
        status: expect.stringContaining('failed'),
        name: expect.stringContaining(step.name),
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('This step is expected to fail for test purposes') }) ]) }) }) )
})

test('closeBrowser closes a browser on an initialized runner', async () => {
  runner = await Runner.closeBrowser(runner, configuration)
  expect(runner.automationFramework.browser).toStrictEqual(null)
})