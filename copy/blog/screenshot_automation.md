# Screenshot Automation

## Introduction

This article is intended to give you an overview of Screenshot Automation technology. We will review the platforms that can be automated, the technologies that can be used, and the types of automation that can be performed.

## Screenshot Automation

Screenshot Automation is the process of automatically collecting screenshots from native applications, web applications and web pages. Screenshot automation is generally performed by automated UI test tools that are able to automate interaction and screenshots. These tools are generally complex to implement and maintain. The people who benefit from screenshot automation don't typically have the skills or resources to implement it.

### Applicability

Screenshot Automation is an applicable technology for web applications, large websites with consistent content types, because they have a consistent user interface that changes infrequently. Screenshot Automation is less applicable for desktop and native applications because they have less consistent tools and interfaces for automation. Screenshot Automation is a less applicable technology for documenting processes that use multiple applications, or ad hoc screenshots.

If you spend lots of time collecting screenshots, and think your workflow could benefit from screenshot automation, contact us.

### Audiences

* **Technical Writers** responsible for documenting large applications or websites
* **Marketers** responsible for maintaining large collections of product media that is displayed on articles, websites and markting materials
* **Trainers** responsible for maintaining training courses, training videos, manuals, and curriculum that makes heavy use of screenshots
* **QA Technicians** responsible for maintaining large libraries of tests, and ensuring that the look and feel of an application remains consistent through multiple versions

## Platforms

### Desktop Applications

It would be very useful to automatically collect screenshots from Desktop Applications. Due to the broad landscape of desktop application development, it is difficult to automate the collection of screenshots. There are a few platform-specific tools that can be used to automate screenshot collection on desktop applications.

#### Windows

There are a number of legacy tools available for automating native Windows applications. Recently, Microsoft has begun to embrace and publicize the use of WinAppDriver:

> Windows Application Driver (WinAppDriver) is a service to support Selenium-like UI Automation on Windows Applications. This service supports testing Universal Windows Platform (UWP), Windows Forms (WinForms), Windows Presentation Foundation (WPF), and Classic Windows (Win32) apps on Windows 10 PCs.

[WinAppDriver github](https://github.com/microsoft/WinAppDriver)

#### Macintosh

Macintosh offers the XCTest framework, which is consistently used for desktop applications. It should be used for Macintosh desktop automation. 

> Use the XCTest framework to write unit tests for your Xcode projects that integrate seamlessly with Xcode's workflow.
>
> Tests assert that certain conditions are satisfied during code execution, and record failures (with optional messages) if those conditions aren’t satisfied. Tests can also measure the performance of blocks of code to check for performance regressions, and can interact with an application's UI to validate user interaction flows.

[XCTest site](https://developer.apple.com/documentation/xctest)

### Mobile Applications

Broadly, there are two types of mobile applications that could be targetted for screenshot automation: Native Apps, Mobile Web Apps, and Hybrid Apps. Any Mobile Web app, and the web components of Hybrid Apps can use normal web application screenshot tools. Screenshots of native components of mobile applications must be collected using a tool that can target native mobile applications.

#### Native Mobile Applications

Screenshot Automation on Mobile devices can be performed using multiple frameworks. The Appium framework is a desireable platform because it is able to target multiple mobile OS's, and its compatibility with existing frameworks.

> Appium is an open source automation framework for use with native, hybrid and mobile web apps. It drives iOS, Android, and Windows apps using the WebDriver protocol.

[Appium Website](https://appium.io/index.html)

There are additional tools for automating mobile apps with similar features, which can target multiple frameworks. 

* [Selendroid](http://selendroid.io/), which provides an iOS driver despite it's name
* [XCTest site](https://developer.apple.com/documentation/xctest), which is a great option if you don't need to work with other platforms

### Web Applications

Web Applications have the most potential for screenshot automation due to their consistent UI elements, and long-standing standards for design and automation. The Engineering community has primarily used the WebDriver protocol in the past. More recently, the DevTools protocols have gained popularity and mainstream adoption. Selection of tools should take this into account early, as deciding between the WebDriver and DevTools protocols will impact the maturity and capability of the tools you select.

The main difference between WebDriver and DevTools is that WebDriver requires middleware to operaterate. It requires a driver to automate a target. Many Browsers and Browser Engines implement the DevTools Protocol.

* [ChromeDriver](https://chromedriver.chromium.org/)
* [ChromiumDriver](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/chromium/ChromiumDriver.html)
* [EdgeDriver](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/edge/EdgeDriver.html) 
* [EventFiringWebDriver](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/support/events/EventFiringWebDriver.html)
* [FirefoxDriver](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/firefox/FirefoxDriver.html)
* [InternetExplorerDriver](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/ie/InternetExplorerDriver.html)
* [OperaDriver](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/opera/OperaDriver.html)
* [RemoteWebDriver](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/remote/RemoteWebDriver.html)
* [SafariDriver](https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/safari/SafariDriver.html)
* [Ghost Driver](https://github.com/detro/ghostdriver)
* [HTMLUnitDriver](https://github.com/SeleniumHQ/htmlunit-driver)
* [Selenium2Driver](https://mink.behat.org/en/latest/drivers/selenium2.html)

[Source](https://www.programsbuzz.com/article/different-types-drivers-available-selenium-webdriver)

#### WebDriver Protocol

> WebDriver is a remote control interface that enables introspection and control of user agents. It provides a platform- and language-neutral wire protocol as a way for out-of-process programs to remotely instruct the behavior of web browsers.

[WebDriver Standard](https://www.w3.org/TR/webdriver/)

WebDriver is based on the Selenium Protocol. [Selenium](https://www.selenium.dev/) (in it's different incarnations) was the first web automation framework. It is an old and mature framework, with a broad feature set. Many commercial tools use or integrate Selenium in some way:

* [QFTest](https://www.qfs.de/en.html)
* [Ranorex](https://www.ranorex.com/selenium-webdriver-integration/)
* [Tricentis](https://www.tricentis.com/integrations/selenium/)
* [SeleniumBase](https://seleniumbase.io/)

#### DevTools Protocol

> The Chrome DevTools Protocol allows for tools to instrument, inspect, debug and profile Chromium, Chrome and other Blink-based browsers. Many existing projects currently use the protocol. The Chrome DevTools uses this protocol and the team maintains its API.
>
> Instrumentation is divided into a number of domains (DOM, Debugger, Network etc.). Each domain defines a number of commands it supports and events it generates. Both commands and events are serialized JSON objects of a fixed structure.

[Chrome Devtools Protocol](https://chromedevtools.github.io/devtools-protocol/)

Devtools was created because of the perception that WebDriver-based automation tools were slow and flaky. That is not true, and the reliability and speed of WebDriver-based tools has continued to improve over the years. Each of these tools, or classes of tools have their own use cases. 


