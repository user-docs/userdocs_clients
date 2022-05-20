This article is the first of a 3 part series on different ways to capture screenshots of Web Apps. It covers how to manually collect screenshots from web apps. In this series, we'll review:

* Manual Methods (in this article)
* DIY Automated Methods (DIY automation using [Python](https://www.python.com) and [PlayWright](https://playwright.dev/))
* UserDocs 

## Manual Screenshot Collection

There are an almost unlimited number of manual screenshot collection programs. We like [ShareX](https://getsharex.com/) because it's free and open source, and is as full featured as commercial options. ShareX is supported by [donations](https://getsharex.com/donate/), and it's worth considering donating to them.

### Capture a Browser Window

Manual screenshot collection is fairly straightforward. ShareX has a window option that will collect a screenshot of a specific window. To use it, navigate to the desired page, select Capture -> Window -> Browser Window. 

![Capture Window](images/sharex_capture_window.png)

This method will capture the visible portion of the browser.

### Capture the Entire Document

ShareX has an option that will help to capture the entire document. 

![Scrolling Capture](images/sharex_scrolling_capture.png)

To use it, select 'Scrolling Capture.'

![Select Region](images/sharex_scrolling_capture_select_region.png)

After picking this option, ShareX expects you to select a region to attempt to capture. Mouse over the page inside the browser. You'll see a dotted line highlight the region. Click the region in the browser.

![Scrolling Options](images/sharex_scrolling_options.png)

ShareX will present you with options that configure how ShareX will scroll through the page. The defaults are mostly sane. We found that 'Simulate pressing "Page down" key' produces consistent results, and minimizes the number of images that are captured. If you're having issues, you can make changes and experiment here. Once satisfied, click "Start scrolling capture." 

ShareX will scroll through the webpage using scroll down. Then, it will present you with Output Options, which essentially define how ShareX will reassemble the captured image to produce the entire document.

![Scrolling Output Options](images/sharex_scrolling_output_options.png)

We recommend adjusting the Trim Edges -> Right to trim off the scroll bar.  You'll notice that the displayed output will have an overlapping or duplicated area. This can be removed using the Combine adjustments -> Vertical, which will trim the top of image 2 through N (the end of the document) to remove the duplicated areas. You may notice other visual artifacts (like the rounded edges in the screenshot). They can be removed by changing the Trim edges -> Bottom option.

![Scrolling Output Final Options](images/sharex_scrolling_final_options.png)

These are the final options we used to produce the following screenshot, which wasn't bad:

![Scrolling Output Final Output](images/sharex_full_document_final_screenshot.png)