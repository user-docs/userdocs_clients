# Screenshot Automation

## Introduction

This article is intended to give you an overview of Screenshot Automation technology. We will review the platforms that can be automated, the technologies that can be used, and the types of automation that can be performed.

## Screenshot Automation

Screenshot Automation is the process of automatically collecting screenshots from native applications, web applications and web pages. Screenshot automation is generally performed by automated UI test tools that are able to automate interaction and screenshots. These test tools are generally complex to implement and maintain. The people who benefit from screenshot automation don't typically have the skills or resources to implement it.

### Applicability

Screenshot Automation is an applicable technology for applications, because they have a consistent user interface that changes infrequently. Screenshot Automation is not an applicable technology for documenting processes that use multiple applications, or ad hoc screenshots.

### Audiences

* **Technical Writers** responsible for documenting large applications or websites
* **Marketers** responsible for maintaining large collections of product media that is displayed on articles, websites and markting materials
* **Trainers** responsible for maintaining training courses, manuals, and curriculum that makes heavy use of screenshots
* **QA Technicians** responsible for maintaining large libraries of tests, and ensuring that the look and feel of an application remains consistent through multiple versions

## Platforms

### Desktop Applications

It would be very useful to automatically collect screenshots from Desktop Applications. Due to the broad landscape of desktop application development, it is difficult to automate the collection of screenshots. There are a few platform-specific tools that can be used to automate screenshot collection on desktop applications.

#### Windows

There are a number of legacy test tools available for testing native Windows applications. Recently, Microsoft has begun to embrace and publicize the use of WinAppDriver:

> Windows Application Driver (WinAppDriver) is a service to support Selenium-like UI Test Automation on Windows Applications. This service supports testing Universal Windows Platform (UWP), Windows Forms (WinForms), Windows Presentation Foundation (WPF), and Classic Windows (Win32) apps on Windows 10 PCs.

[WinAppDriver github](https://github.com/microsoft/WinAppDriver)

#### Macintosh

Macintosh offers the XCTest 

> Use the XCTest framework to write unit tests for your Xcode projects that integrate seamlessly with Xcode's testing workflow.
>
> Tests assert that certain conditions are satisfied during code execution, and record test failures (with optional messages) if those conditions aren’t satisfied. Tests can also measure the performance of blocks of code to check for performance regressions, and can interact with an application's UI to validate user interaction flows.

[XCTest site](https://developer.apple.com/documentation/xctest)

### Mobile Applications

Broadly, there are two types of mobile applications that could be targetted for screenshot automation: Native Apps, Mobile Web Apps, and Hybrid Apps. Any Mobile Web app, and the web components of Hybrid Apps can use normal web application screenshot tools. Screenshots of native components of mobile applications must be collected using a test tool that can target native mobile applications.

#### Native Mobile Screenshot Automation

Screenshot Automation on Mobile devices can be performed using the Appium framework

### Web Applications

