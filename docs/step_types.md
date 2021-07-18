Step Types are the different types of steps that UserDocs executes in the browser. Each step type has a handler implemented for the selected automation framework (currently, we support puppeteer). Check out the puppeteer step handlers [here](https://github.com/johns10/userdocs_clients/blob/main/packages/runner/src/automation/puppeteer/stepHandlers.ts).

When UserDocs issues a step to the runner for execution, the Automation Framework will look up the handler for it, and execute it on the automated browser.

Some step types require some data entry to execute. Read about each step type in its form reference articles.

Some steps types do not require data entry, including:

## Full Screen Screenshot
Takes a screenshot of the entire view port of the browser window.

## Clear Annotations
UserDocs attaches a record of each annotation to the window. This step type clears all annotations from the window.

## Enable/Disable JavaScript
These steps enable and disable JavaScript from running in the browser. If you disable JavaScript temporarily, you should re-enable it before the end of the process. Failing to re-enable JavaScript may cause failures in downstream steps and processes.

Use this step type in situations where you can't control updates to the page of your application. For example, UserDocs is a server-side rendered application. While collecting screenshots for our application, UserDocs is processing subscription updates in the UI. This causes minor UI changes that result in diffs every time we collect a screenshot. We disable JavaScript to prevent these subscription updates.