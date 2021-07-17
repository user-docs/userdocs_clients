# Features

## Fast Container Builds

The UserDocs CI/CD application compiles down to a single executable binary. Download the binary directly from releases. Install chrome/chromium from your package manager. Start executing screenshot collection jobs. The binary starts a headless Chrome browser and executes your jobs.

## Portable

Execute your CI/CD process anywhere you can access the binary. Run on a cloud server, a local docker machine, or a CI/CD instance inside your VPN.

## Job Execution

Supports the execution of jobs built in UserDocs Desktop. Specify the job ID when you start running the binary, and it will do the rest.

## Consistent Code Base

At it's core, UserDocs CI/CD uses the UserDocs Runner, the core automation application. UserDocs Desktop also uses the Runner. If the process worked in UserDocs Desktop, you can run it with confidence in UserDocs CI/CD.

## Integrates to QA Processes

The UserDocs CI/CD is an open source application. To integrate with your existing QA processes set up NPM and pull the runner. Pass it a browser instance at any point during your QA process. Command it to run steps, processes, or jobs. QA technicians can set up the instance, hydrate it with test data and make assertions. Technical writers can annotate the hydrated application and collect screenshots, and hand the browser instance back to the QA script.

## Supports Multiple Automation Frameworks

We wrote the UserDocs Runner to support multiple Automation Frameworks. The 1.0 version only supports Puppeteer, but it will be easy to add support for a new framework, like Selenium or Cypress. [Contact us](https://www.user-docs.com/contact) with your applications requirements, and we'll add support for your framework.