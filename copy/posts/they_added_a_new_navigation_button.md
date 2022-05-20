They've added a new menu button to the navigation menu, and now all of your full page screenshots are obsolete. Sound familiar?

This is a problem that might take you and your team hours, even days to address manually.

Or, it's a great opportunity to learn more about using automation to help collect screenshots.

If you don't automate your images, you can solve this problem in minutes, with about 20 lines of code. If you've already got Python and Playwright set up, add your URLs, file names, and dimensions to this list and run it:

from playwright.sync_api import Playwright, sync_playwright

targets = [
    {"url": "<url>", "file_name": "<file_name>.png", "width": 1280, "height": 720},
    {"url": "<url_2>", "file_name": "<file_name_2>.png", "width": 1280, "height": 720}
]

def screenshot(page, args):
    page.goto(args["url"])
    page.set_viewport_size({"width": args["width"], "height": args["height"]})
    page.screenshot(path=args["file_name"])

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    for target in targets:
        screenshot(page, target)
    context.close()
    browser.close()
    
with sync_playwright() as playwright:
    run(playwright)

I've included links to getting started with Python and Playwright in the comments. If you try it, let me know how it went!