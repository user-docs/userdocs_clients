const Query = require('../lib/query.ts')
const { job } = require('../lib/queries.ts')
const { UPDATE_JOB } = require('../lib/mutation')
const Runner = require('../../runner/runner')
const Job = require('../../runner/lib/domain/job')
const Client = require('../lib/cicd')
const util = require('util')
require('dotenv').config()

function base_url() { return 'https://' + process.env.DEV_HOST + ':' + process.env.DEV_PORT };
function auth_url() { return 'https://' + process.env.DEV_HOST + ':' + process.env.DEV_PORT + '/api/session'};
function api_url() { return 'https://' + process.env.DEV_HOST + ':' + process.env.DEV_PORT + '/api' };
function auth_params() { return { email: 'johns10davenport@gmail.com', password: 'userdocs'}; }

test('executeJob', async () => {
  var cicd = await Client.initialize(base_url(), auth_params())
  const result = await Client.executeJob(cicd, 1)
})
