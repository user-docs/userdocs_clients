import * as yargs from 'yargs'
import * as Cicd from './cicd'
import * as dotenv from 'dotenv'

dotenv.config()

yargs
  .scriptName("userdocs-cicd-runner")
  .usage('$0 <cmd> [args]')
  .command('execute-jobs [jobs..]', 'welcome to userdocs!!', (yargs) => {
    yargs.positional('jobs', {
      type: 'number',
      describe: 'the jobs to run'
    })
  }, async function (argv) {
    var url
    if (argv.dev) url = 'https://' + process.env.DEV_HOST + ':' + process.env.DEV_PORT
    else url = 'https://' + process.env.PROD_HOST

    const credentials = {
      email: process.env.USERDOCS_USERNAME,
      password: process.env.USERDOCS_PASSWORD
    }

    var cicd = await Cicd.initialize(url, credentials)
    for (const jobId of (argv.jobs as Array<number>)) {
      await Cicd.executeJob(cicd, jobId)
    }
    await Cicd.tearDown(cicd)
  })
  .option('dev', {
    alias: 'd',
    description: 'Run in dev mode',
    type: 'boolean',
  })
  .help()
  .argv
