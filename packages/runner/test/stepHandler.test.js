const { Puppet } = require('../lib/automation/puppet')

test('stepFunction returns a navigate function', async () => {
  const step = { stepType: { name: 'Navigate' } }
  handler = Puppet.stepHandler(step)
  expect(handler.name).toBe('Navigate')
})

test('stepFunction returns a click function', async () => {
  const step = { stepType: { name: 'Click' } }
  handler = Puppet.stepHandler(step)
  expect(handler.name).toBe('Click')
})

test('stepFunction returns a Fill Field function', async () => {
  const step = { stepType: { name: 'Fill Field' } }
  handler = Puppet.stepHandler(step)
  expect(handler.name).toBe('Fill Field')
})

test('stepFunction returns a Element Screenshot function', async () => {
  const step = { stepType: { name: 'Element Screenshot' } }
  handler = Puppet.stepHandler(step)
  expect(handler.name).toBe('Element Screenshot')
})

test('stepFunction returns a Full Screen Screenshot function', async () => {
  const step = { stepType: { name: 'Full Screen Screenshot' } }
  handler = Puppet.stepHandler(step)
  expect(handler.name).toBe('Full Screen Screenshot')
})

test('stepFunction returns a Clear Annotations function', async () => {
  const step = { stepType: { name: 'Clear Annotations' } }
  handler = Puppet.stepHandler(step)
  expect(handler.name).toBe('Clear Annotations')
})

test('stepFunction returns a Apply Annotation function', async () => {
  const step = { stepType: { name: 'Apply Annotation' } }
  handler = Puppet.stepHandler(step)
  expect(handler.name).toBe('Apply Annotation')
})