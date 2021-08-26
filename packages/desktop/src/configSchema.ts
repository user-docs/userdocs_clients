export let configSchema = {
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
  },
  chromePath: {
    type: 'string',
    default: ''
  },
  applicationUrl: {
    type: 'string',
    default: 'https://app.user-docs.com'
  },
  userId: {
    type: 'number'
  }
}
