# Screenshot Collection Tools

The print screen button has come a long way. There are a number of tools that are useful for streamlining the process of capturing and editing screenshots for use in documentation. In this article, we'll attempt to enumerate the features that may be important to technical writers, the types of tools that are available, and why you might consider one type of tool over another.

## Important Features

Screenshot tools can do a lot more than just capture your screen and save it to a file. Some of these features may be very helpful to your screenshot collection workflows.

### Regions

Any screenshot tool can capture the entire screen. Many tools can support capturing additional regions of the screen. Most will capture a window or allow you to draw a box/area to capture. Here's a short listing of the regions you may be concerned with as a technical writer:

* **Full Screen/Multiple Screens** - This is the basic region that all screenshot capture tools support. This mode will capture your entire screen, or multiple screens if they are connected to your computer.
* **Selectable Region** - Most commercial screenshot tools will allow you to draw a region on the screen, and capture that region in an image file. This is a must-have feature for manual screenshot collection tools.
* **Window** - Most commercial screenshot tools will allow you to select a particular window to capture a screenshot of, like a browser or desktop application
* **Scrolling Window** - Better commercial screenshot tools will automatically toggle the scroll bars in a window, capture screenshots, and stitch the collected screenshots together to produce a screenshot of the entire contents of the window. This is highly effective for capturing the entire window of a long browser application or page.
* **HTML Document** - Many browser extensions will capture an entire HTML document without scrolling. This is a feature that would be characteristic of Chrome Extensions, or automation tools that leverage browser automation. 
* **HTML Element(s)** - Capturing screenshots of individual HTML Element(s) is an extremly useful feature for documenting web products and pages. This feature will only be available in screenshot applications that leverage browser automation to collect screenshots. It can be done manually using a selectable region.

### Annotations

Annotations refers to the arrows, boxes, blurs, circles, and text that can be applied to screenshots before publishing them. Application of annotations is a common practice among technical writers, and helps to clarify what part of the screenshot the user should be focused on.

Application of annotations is an important feature for technical writers. It can be very useful to apply annotations using a tool that accompanies your screenshot collection tool (such as [Snagit](https://www.techsmith.com/screen-capture.html) or [Greenshot](https://getgreenshot.org/).

It's most important to apply and save annotations using an editor that supports layers. Don't use a single-layer raster-based image editor (such as paint) to make annotations, because they won't be modifiable later. The screenshot will have to be taken and annotated again.

If annotations are made using a layer-based image editor, such as [paint.net](https://www.getpaint.net/), [Gimp](https://www.gimp.org/), or [Ilustrator](https://www.adobe.com/ca/products/illustrator.html), they can be modified later if the underlying screenshot changes.

### Click to Capture

A less common feature in screenshot collection applications is click-to-capture. When collecting screenshots, it can be helpful to capture a screenshot every time you click, or otherwise interact with your computer. Using click-to-capture keeps you from missing steps, or collecting the screenshot to early or too late. Tools like [Task Capture, formerly known as Stepshots](https://www.uipath.com/product/task-capture) or Windows Step Recorder will collect a screenshot every time you click.

### Automation

Screenshots have been collected manually for the last 40 years. It's time for that to change. The industry is just starting to provide tools that enable technical writers to automatically collect screenshots from applications. However, these tools commonly require significant technical expertise, or only work for a very narrow set of use cases.

Most automated screenshot collection is powered by some sort of automation framework. See our [Screenshot Automation Technology](https://user-docs.com/2021/10/06/screenshot-automation-technology/) article for a more detailed look at the technologies and techniques that enable screenshot automation. There are a number of commercial tools available that leverage these technologies.

### Sharing and Publication

Technical Writers commonly need to share or publish screenshots to someone else, or a remote location for use in documentation. It can be useful for a screenshot tool to directly publish screenshots to that remote location, once they've been updated and validated. Many commercial screenshot tools support publication to multiple different applications and file sharing providers.

## Types of Applications

Based on the features above, we've tried to categorize several types of tools. Generally, technical writers working on a product will follow a similar workflow. Most commercial screenshot capture tools only support a subset of this workflow:

* Start The Application
* Enter and save any data that's required to get a good screenshot
* Set the scene for the screenshot (click stuff, fill in fields)
* Collect the screenshot
* Annotate the screenshot
* Perform any post-editing optimizations or conversions
* Publish the image to a CDN, Github, remote server, or proprietary knowledge base server

### Manual Screenshot Capture Tools

These are traditional screenshot capture tools. They are typically used to manually collect, sometimes annotate, and sometimes publish a manually collected screenshot. Many of these tools are quite mature, and have a number of additional features, such as storing and cataloguing, labels, OCR, public web storage and links, and more. These are excellent general-purpose tools that every technical writer should have at their disposal. 

There are many more manual screenshot tools on the market. This list is incomplete. A few noteworthy examples are:

* Snipping Tool - Microsoft tool that comes with Windows. Allows users to capture multiple regions, and apply simple annotations.
* [Snagit](https://www.techsmith.com/screen-capture.html) - Premium screenshot product that supports multiple region capture modes, annotations, sharing/publication, OCR, labelling, and much more.
* [Greenshot](https://getgreenshot.org/) - Free and open-source screenshot product that supports region capture modes and annotations.
* [DroplR](https://droplr.com/) - Screenshot collection app that runs in a chrome extension. Supports multiple regions, annotations, and automatically publishes for easy sharing and publication.
* [Monosnap](https://monosnap.com/) - Similar to droplr. Runs in an extension, supports multiple regions, annotations, and publishes to multiple locations.
* [Cleanshot](https://cleanshot.com/) - Desktop screen capture application for OSX. Supports multiple regions, annotations, click-tol-capture, video capture, video editor, cloud storage, overlays, OCR, and more.

Manual screenshot collection is great for IT departments, business analysts, technical writers with a large mix of architectures they must support (mobile, web, desktop, physical, api). However, manual screenshot collection is not a good solution for technical writers who support web-based software applications, because:

* Screenshot collection is time consuming
* Screenshot collection is error-prone, missing a click or field may mean you have to do the whole scene again 
* The app will change in the future, and obsolete the screenshot
* Application changes are difficult to find and address manually

### Automated Screenshot Capture Tools

Almost every automation framework supports a screenshot feature. However, the use of automation frameworks typically requires a QA tech or engineer to program and operate, making the use of this technology infeasible for most organizations and technical writers. However, some companies have started offering automated screenshot collection tools for a narrow use case. If your needs meet the following criteria, you should consider using simple screenshot automation:

* App is web-based
* Runs on a public server
* Doesn't require authentication
* No annotation requirements

If that's the case, there are a number of different products that will open a headless browser, navigate to the URL you've passed it, and collect a screenshot. Some more advanced tools will perform visual regression testing against your website and notify you of changes. A few of those tools are:

* [URL2PNG](https://www.url2png.com/) - Supports a simple HTTP API that can be called directly from the page. The URL2PNG tool will collect the screenshot every time a call is made to that endpoint. It can also be run as part of a script to regularly collect screenshots. Would require software engineering skills to implement. There are a number of alternatives, which are listed on [their website](https://www.url2png.com/alternatives).
* [StillIO](https://www.stillio.com/) - Use StillIO's UI to add a list of URL's to screenshot. It supports some additional features, like clicking on something, syncing screenshots to a variety of endpoints, and passing custom parameters to the page it's loading. Performs visual regression testing on the screenshots, and sends alerts when the collected screenshots are different.

Some of the drawbacks of these newer screenshot automation tools are:

* Authentication is impossible unless you pass in a token as a URL parameter
* Implementation is very difficult
* Any complex setup, like clicking or filling fields is out of the question
* Automating a product behind a VPN is impossible
* You still have to annotate the image in post before it can be published, and as a consequence, publication must be manual as well

## UserDocs

We've developed UserDocs for technical writers who support web-based applications, because it's possible to solve all the problems with manual screenshot collection, and newer automated screenshot collection tools automatically.

* UserDocs is a desktop application, so it's not subject to VPN restrictions
* UserDocs supports a durable, local store for your authentication and session information so that you can log on and access the application without sending your credentials to a remote server
* UserDocs supports automated annotations so you don't have to use an additional tool/step to apply annotations to your images
* UserDocs supports visual regression testing, so you'll be alerted to changes in your applications immediately
* UserDocs features an authoring assistant that makes it easy to implement screenshot automation without an Engineering degree

If you're a technical writer responsible for a web-based product, and you're interested in automatically collecting and updating your screenshots, [contact us](https://user-docs.com/contact/), or chat with us on our website. 