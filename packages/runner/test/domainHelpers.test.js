const Helpers = require('../lib/domain/helpers')

test('Helpers.fetchCallbacks returns a list of functions', async () => {
  hello = () => { return 'Hello' }
  world = () => { return 'World' }
  lib = { hello: hello, world: world }
  result = Helpers.fetchCallbacks([ 'hello', world ], lib)
  expect(result).toStrictEqual([ hello, world ])
})