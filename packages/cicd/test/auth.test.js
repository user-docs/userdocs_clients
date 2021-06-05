const { authenticate } = require('../lib/auth.ts')
require('dotenv').config()

function url() {
  return 'https://' + process.env.DEV_HOST + ':' + process.env.DEV_PORT
}

test('authenticate returns a token', async () => {
  auth = { authUrl: url() + '/api/session', email: 'johns10davenport@gmail.com', password: 'userdocs'}
  const tokens = await authenticate(auth)
  expect(tokens).toHaveProperty('access_token')
  expect(tokens).toHaveProperty('renewal_token')
})
