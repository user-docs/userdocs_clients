const { query } = require('../lib/query.ts')
const { authenticate } = require('../lib/auth.ts')
const { stepInstance, job } = require('../lib/queries.ts')
const fs = require('fs')
require('dotenv').config()

function auth_url() { return 'https://' + process.env.DEV_HOST + ':' + process.env.DEV_PORT + '/api/session'};
function api_url() { return 'https://' + process.env.DEV_HOST + ':' + process.env.DEV_PORT + '/api' };
function auth_params() { return { authUrl: auth_url(), email: 'johns10davenport@gmail.com', password: 'userdocs'}; }


test('query returns a result', async () => {
  const tokens = await authenticate(auth_params())
  const queryText = job(1)
  response = await query.execute(api_url(), tokens, queryText);
  console.log(response)
})