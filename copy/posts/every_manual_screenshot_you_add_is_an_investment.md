Every manually-collected screenshot you add to your documentation is an ongoing time commitment for you and your team.

Think about it. It took you 15+ minutes to set up your environment, set the scene, take the screenshot, annotate it, and upload it to your documentation system.

If you put it in your documentation, future you won't thank you. You'll have to do that work again when the page changes, and again, and again, and again. The better and faster your company is at releasing software, the more you'll have to update it.

Technical writers are digging ourselves in deeper and deeper. We need more time and resources just to maintain the documentation we've already created.

We need to get off this merry go round and get back to writing good documentation and helping move our business forward.

Screenshot Automation is the way off this merry go round.

Set up Python (https://www.python.org/) and Playwright (https://playwright.dev/docs/intro#installation). It only takes 5 lines of code to get your first automated screenshot:

`
browser = playwright.chromium.launch(headless=False)
context = browser.new_context()
page = context.new_page()
page.goto("https://the-internet.herokuapp.com/login")
page.set_viewport_size({"width": 1280, "height": 720})
page.screenshot(path='screenshot.png', full_page=True)
`

Let me know how it goes in the comments.