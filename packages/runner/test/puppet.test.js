const { Puppet } = require('../lib/automation/puppet')

test('openBrowser opens the browser', async () => {
  browser = await Puppet.openBrowser({})
  //TODO: Figure out this assertion
  //expect(typeof browser).toBe('Browser')
  await Puppet.closeBrowser(browser, {})   
})
