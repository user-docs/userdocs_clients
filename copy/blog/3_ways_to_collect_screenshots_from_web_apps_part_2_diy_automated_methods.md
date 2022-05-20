This article is the second of a 3 part series on different ways to capture screenshots of Web Apps. It covers how to automatically collect screenshots from Web Apps, using a DIY approach. In this series, we'll review:

* [Manual Methods](https://user-docs.com/2022/01/11/manual-screenshot-collection-methods/)
* DIY Automated Methods (This article)
* UserDocs 

## DIY Automated Screenshot Collection

![Python Plus Playwright](images/python_plus_playwright.png)

It's easier than it sounds to collect screenshots using browser automation, especially with tools that work on the devtools protocol like [Puppeteer](https://developers.google.com/web/tools/puppeteer) and [Playwright](https://playwright.dev/), because they reduce the infrastructure requirements needed to get started.

### Prerequisites

Before starting this, you'll need to [install Python](https://www.python.org/downloads/) on your local machine. We recommend using the official installer for your platform. Once Python is installed, [install Playwright](https://playwright.dev/python/docs/intro#installation) like this from the command prompt:

```
pip install --upgrade pip
pip install playwright
playwright install
```

This installer should take care of installing prerequisites, and a browser that Playwright can control.

### Example

It takes a short stanza to navigate to start the browser, open a page, navigate to a URL, set the size of the viewport (which controls the size of the screenshot), and take a screenshot of the page.

Note the `full_page=true` option in the `screenshot` command, which will cause Playwright to capture a screenshot of the entire document. Omitting the `full_page=true` option will capture the scrolled content inside the viewport. In this example, omit `full_page=true`, and it will produce a screenshot that is 1280 x 720 px.

Also notice `headless=False` in the `chromium.launch`ccommand . That means Playwright will open a visible browser so you can observe and debug what it's doing. If you leave `headless=False` out, it will open the browser in headless mode, and do all the work in the background

```
from playwright.sync_api import Playwright, sync_playwright

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://nicepage.com/sd/41038/long-text-website-design")
    page.set_viewport_size({"width": 1280, "height": 720})
    page.screenshot(path='screenshot.png', full_page=True)
    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
```

This script will save the resulting screenshot to `screenshot.png` in the directory you run it from.

## Automated Screenshot Collection in Userdocs

Userdocs is designed to collect screenshots from web apps, so there are a number of ways to capture, annotate, and process screenshots. We'll cover two simple use cases.

### Simple Screenshot Collection Process

You should already have a [Project](https://user-docs.com/docs/userdocs-web-documentation/projects/) and a [Process](https://user-docs.com/docs/userdocs-web-documentation/processes/).

![Simple Screenshot Process](images/simple_screenshot_process.png)

1. Create a [Navigation Step](https://user-docs.com/docs/userdocs-web-documentation/steps/step-types/navigation-step-form/). This step should navigate to the URL you wish to take a screenshot of.
2. Create a [Set Size Step](https://user-docs.com/docs/userdocs-web-documentation/steps/step-types/set-size-explicit-step/). This step will set the size of the viewport to the size you specify.
3. Create a Full Screen Screenshot Step.

### Full Document Screenshots

The 'Full Document Screenshot' feature, and page administration is only available in the Beta version, which hasn't been released as of 1/9/2022. Stay tuned for the Beta release if you're interested in this feature.

