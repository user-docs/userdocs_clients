One night, I was working late to document a particularly complex form.

The form would change once the object was created, so I had to catch the screenshot on a new object. I had to go through and enter data, and click a bunch of things on the form to set the scene. 

I had done a bunch of screenshots in bulk, and I had to repeat this one because I'd made a mistake when setting up the form for the screenshot. I wound up doing the same screenshot 3-4 times before I finally got everything right for the document. It took me over an hour to get that one screenshot right.

After finishing the document and going home, I thought there must be a better way to do this work. I started researching ways to automate screenshot collection.

I found two major types of screenshot automation. Cloud-based image collection services, and browser automation tools.

Cloud-Based Image Collection Services 

These applications run on the internet. They open an automated browser on their server, access the configured URL, and take a screenshot. Many of these servers run through an API (usually REST), which you must call from a script. Some offer advanced features, like clicking on elements before capturing a screenshot.

Examples of these vendors are: StillIO, Url2Png, HexoWatch, UrlBox, and Grabzit (see comments for links)

These are great services if you have public, open instances of your software, and you don't add annotations/callouts to your screenshots. However, if you want to work on test/staging instances, applications that are secured with credentials, or instances that are behind firewalls/VPN's, these services will not work. Additionally, if you add callouts/annotations to your screenshots, you'll still have to do that manually after the screenshots are collected.

Browser automation tools are commonly used by QA departments to automate user actions like navigating to URL's, clicking buttons, entering text into fields, submitting forms, running Javascript, and capturing screenshots. These tools are perfectly suited for the task. They run on your local machine, so they can punch through VPN's and firewalls to test and staging instances. They use a local data directory so you can preserve login sessions and credentials on your computer without compromising security.

Examples of browser automation tools are: PlayWright, Selenium, SeleniumBase, Cypress, and Puppeteer

Technical writers aren't generally familiar with browser automation tools, how to use them, and how these tools can benefit them.

At UserDocs, we believe technical writers and marketers supporting web applications should have access to a library of image and video content that's automatically generated and updated. We provide resources that help teams leverage browser automation technology to build and maintain these libraries. Keep an eye on the UserDocs blog so you can learn how these technologies benefit you and your team, and DM me if you're interested in learning more!

Cloud-based screenshot automation vendors:
https://www.stillio.com/
https://www.url2png.com/
https://hexowatch.com/
https://urlbox.io/
https://grabz.it/

Browser automation tools:
https://playwright.dev/
https://www.selenium.dev/
https://seleniumbase.io/
https://www.cypress.io/
https://developers.google.com/web/tools/puppeteer