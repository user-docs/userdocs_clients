module.exports = {
	automationFrameworkName: {
		type: 'string',
    default: 'puppeteer'
	},
	maxRetries: {
		type: 'number',
    default: 10
	},
	environment: {
		type: 'string',
    default: 'desktop'
	},
  imagePath: {
		type: 'string',
    default: ''
  },
  userDataDirPath: {
    type: 'string',
    default: ''
  }
}
