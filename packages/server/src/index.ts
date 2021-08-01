import { ApolloServer, gql } from 'apollo-server'
import { GraphQLClient } from 'graphql-request'

import * as Runner from '@userdocs/runner'

interface Server {
  server: ApolloServer,
  client: GraphQLClient,
  runner: Runner.Runner
}

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

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
      css: String
      overrides: [Override]
    }
    type Override{
      projectId: Int
      url: String
    }
    input OverrideInput{
      projectId: Int
      url: String
    }
    type Mutation {
      openBrowser: Browser
      configuration(maxRetries: Int!, imagePath: String!, userDataDirPath: String!, css: String!, overrides: [OverrideInput]): Configuration
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
      configuration(_, {maxRetries, imagePath, userDataDirPath, css, overrides}) { 
        console.log("Configuration Mutation")
        store.set({maxRetries: maxRetries, imagePath: imagePath, userDataDirPath: userDataDirPath, css: css, overrides: overrides})
        return store.store
      }
    }
  };
}

function create(args) {
  return {
    server: null,
    store: args.store,
    runner: null,
    port: args.port,
    tokens: args.tokens,
    client: null,
    url: args.url
  }
}

function createRunner(state) {
  let runner =  Runner.initialize(defaultConfiguration())
  state.runner = runner
  return state
}

export function initializeClient(state) {
  const url = state.url
  const headers = {authorization: state.tokens.access_token}
  if (state.tokens.access_token && state.tokens.renewal_token) {
    state.client = new GraphQLClient(url + "/api", { headers: headers })
    return state
  } else {
    throw new Error("No authentication headers found")
    state.status = "error"
    state.error = "No authentication headers found"
    return state
  }
}

export function initializeServer(state) {
  var typeDefs = defaultSchema()
  var resolvers = defaultResolvers(state.runner, state.store)
  const server = new ApolloServer({typeDefs, resolvers});
  state.server = server
  return state
}

export async function getConfiguration(state: Server): Promise<any> {
  const query = gql`  
    query getUser($id: ID!) {
      user(id: $id) {
        configuration {
          strategy
          css
        }
      }
    }
  `
  const result = await state.client.request(query, {id: 1})
  return result
}

async function start(state) {
  if (!state.server) throw new Error("Server not initialized, call initializeServer first")
  await state.server.listen({port: state.port});
  return state
}

function put(state, key, value) { 
  state[key] = value 
  return state
}

function query(state) {

}

function stop(state) {
  state.server.stop()
}

export { create, start, stop }