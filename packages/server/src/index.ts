import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema, execute, subscribe } from 'graphql' 
const { createServer } = require('http');
import * as Runner from '@userdocs/runner'
import { SubscriptionServer } from 'subscriptions-transport-ws'

const PORT = 4100;

const configuration = {
  automationFrameworkName: 'puppeteer',
  maxRetries: 3,
  environment: 'desktop',
  imagePath: 'imagePath',
  userDataDirPath: '',
  strategy: "xpath",
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

let runner

runner =  Runner.initialize(configuration)

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Browser{
    status: String
  }
  type Mutation {
    openBrowser: Browser
  }
  type Query {
    browser: Browser 
  }
  type Subscription
`);
 
// The root provides a resolver function for each API endpoint
var root = {
  openBrowser: async () => {
    Runner.openBrowser(runner)
    return { status: 'opening' }
  },
  browser: () => {  
    if (runner.automationFramework.browser) return { status: 'open' }
    else return { status: 'closed' }
  }
};


var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: ({ subscriptionEndpoint: `ws://localhost:${PORT}/subscriptions` } as any) // TODO: Figure out why I had to cast as any
}));

const ws = createServer(app)

ws.listen(PORT, () => {
  // Set up the WebSocket for handling GraphQL subscriptions.
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: ws,
      path: '/subscriptions',
    },
  );
});

console.log('Running a GraphQL API server at http://localhost:4100/graphql');