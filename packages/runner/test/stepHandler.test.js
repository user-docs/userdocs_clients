const { Puppet } = require('../src/automation/puppet')
const { guardBoundingBox } = require('../src/automation/puppeteer/stepHandlers')

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

test('stepFunction returns a Wait For Element function', async () => {
  const step = { stepType: { name: 'Wait for Element' } }
  handler = Puppet.stepHandler(step)
  expect(handler.name).toBe('Wait for Element')
})

test('getBoundingBox returns the correct result for in-viewport calculation', () => {
  const box = {x: 5, y: 5, width: 5, height: 5}
  const step = {marginTop: 1, marginBottom: 1, marginLeft: 1, marginRight: 1}
  const viewport = {height: 20, width: 20}
  result = guardBoundingBox(box, step, viewport)
  expect(result).toStrictEqual({"x": 4, "width": 7, "y": 4, "height": 7})
})

test('getBoundingBox returns the correct results for positive out-of-viewport calculations', () => {
  expect(guardBoundingBox({x: 5, y: 5, width: 5, height: 5}, {marginTop: 1, marginBottom: 1, marginLeft: 1, marginRight: 1}, {height: 10, width: 10}))
    .toStrictEqual({x: 4, width: 6, y: 4, height: 6})
})

test('getBoundingBox returns the correct results for negative out-of-viewport calculations', () => {
  expect(guardBoundingBox({x: 0, y: 0, width: 5, height: 5}, {marginTop: 1, marginBottom: 1, marginLeft: 1, marginRight: 1}, {height: 10, width: 10}))
  .toStrictEqual({x: 0, width: 6, y: 0, height: 6})
})
