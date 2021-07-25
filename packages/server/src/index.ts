import { ApolloServer, gql } from 'apollo-server'

import * as Runner from '@userdocs/runner'

function defaultConfiguration() {
  return {
    automationFrameworkName: 'puppeteer',
    maxRetries: 3,
    maxWaitTime: 10,
    environment: 'desktop',
    imagePath: 'imagePath',
    userDataDirPath: '',
    strategy: "xpath",
    appDataDir: '',
    appPath: '',
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
}

function defaultSchema() {
  return gql`
    type Browser{
      status: String
    }
    type Configuration{
      maxRetries: Int
      imagePath: String
      userDataDirPath: String
    }
    type Mutation {
      openBrowser: Browser
      configuration(maxRetries: Int!, imagePath: String!, userDataDirPath: String!): Configuration
    }
    type Query {
      browser: Browser 
      configuration: Configuration
    }
    type Subscription {
      browser: Browser
    }
  `
}

function defaultResolvers(runner, store) {
  return {
    Query: {
      browser: () => {  
        if (runner.automationFramework.browser) return { status: 'open' }
        else return { status: 'closed' }
      },
      configuration: () => { 
        return store.store
      }
    },
    Mutation: {
      openBrowser: async () => {
        Runner.openBrowser(runner)
        return { status: 'opening' }
      },
      configuration(_, {maxRetries, imagePath, userDataDirPath}) { 
        console.log("COnfiguration Mutation")
        store.set({maxRetries: maxRetries, imagePath: imagePath, userDataDirPath: userDataDirPath})
        return store.store
      }
    }
  };
}

function create(store) {
  let runner =  Runner.initialize(defaultConfiguration())
  var resolvers = defaultResolvers(runner, store)
  var typeDefs = defaultSchema()
  const server = new ApolloServer({ typeDefs, resolvers });
  return {
    server: server,
    store: store,
    runner: runner
  }
}

function start(state, port) {
  state.server.listen({port: port}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

function stop(state) {
  state.server.stop()
}

export { create, start, stop }