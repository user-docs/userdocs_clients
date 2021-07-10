Step Types are the different types of steps that can be executed in the browser. Each step type has a handler implemented for the selected automation framework (we only support puppeteer at this time). Check out the puppeteer step handlers [here](https://github.com/johns10/userdocs_clients/blob/main/packages/runner/src/automation/puppeteer/stepHandlers.ts).

When a step is issued to the runner for execution, the Automation Framework will look up the handler for it, and execute it on the automated browser.

Many of the step types require additional inputs to execute. Information on each of these types, and their fields can be found in their individual form reference articles:
* [Click](step_form_click.md)
* [Fill Field](step_form_fill_field.md)
* [Navigate](step_form_navigate.md)
* [Set Size Explicit](step_form_set_size_explicit)

Some steps types do not require additional inputs, including:

## Full Screen Screenshot
Takes a screenshot of the entire viewport (may be bounded by the window).

## Clear Annotations
A record of each annotation is attached to the window. This step type clears all annotations from the window.

## Enable/Disable Javascript
These steps enable and disable javascript from running in the browser. If you disable javascript temporarily, you should re-enable it before the end of the process. Failing to re-enable javascript is likely to cause failures in downstream steps and processes.

This step type should be used in situations where the page of your application is being updated beyond your control. For example, UserDocs is a server-side rendered application. While we are collecting screenshots for our own application, it is processing subscription updates in the UI. This causes minor UI changes that result in diff errors every time we collect a screenshot. We disable Javascript to prevent these subscription updates from being processed.