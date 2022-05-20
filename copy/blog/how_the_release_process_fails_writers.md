This article explores software releases from a technical writers perspective. It explores how a typical release fails to set us up for success, and techniques writers and development teams can use to ease the release process for writers.

## The Release Process

If you've done technical writing for a software company for more than a year, you've experienced a release. Most of the ones I've participated go something like this:

![Release Workload](images/release_workload.png)

* Engineering develops features and bug fixes for some amount of time
* Towards the end of the release (potentially after locking the branch, potentially before), QA activity ramps and peaks
* Heavy testing means bugs get found, and need fixing, driving more Engineering work during the QA peak
* As QA and Engineering work ramps down, the build stabilizes, and opens the door for Technical Writers to begin work

Getting involved before fixing the bugs is challenging for technical writers. You can't document things when you don't know how they work, and you can't take screenshots of things that don't look like the finished product. We can find ways to pull ahead on this work (read more below). 

In reality, writers often have to repeat this work after the final changes land. Their instance gets blown away/corrupted, behaviours change, or UI's change to the point where the old work isn't worth changing, or is useless. The exception here is the documentation plan, which should be (at least) a list of documents that technical writers must change or update in the release.

The heart of this problem: the product is ready for documentation AFTER the Engineers and QA's have finished their job. That's also when the business is ready to release the product. There's a lot of pressure on technical writers to get a lot done in a short period of time, with limited ability to prepare for the crunch.

## What Technical Writers Get

Typically writers get a brain dump from the PM, the release notes, and a big list of tickets. Technical Writers review these lists, pick through the product, and update everything that changed. Expecting humans to do a good job of this is unrealistic. Even if writers have access to a live instance running the previous version, they are not going to identify all the changes. 

![Where's Waldo Book Page](images/wheres_waldo.jpg)

This is like playing "Spot the Difference" with a Where's Waldo book. The team won't catch everything. Some documents and screenshots will get missed. 

## How to Improve the Release Process for Technical Writers

### Planning Techniques

It's important to collaborate with Product Managers before the release to understand what new features are coming in the release. If you know what features are in, you can map them to the types of documents you create to build a high level documentation plan. 

#### Know Your Structure

You should Know the types of documentation you produce in advance. I use the [Diataxis](https://diataxis.fr/) framework, created by [Daniele Procida](https://www.linkedin.com/in/danieleprocida/) to define this. 

#### Plan What Documents You'll Write

These techniques focus on a per-document approach. I'm interested to hear from other technical writers on how to create a topic-based documentation plan for a release, and whether that style of documentation has techniques that can help with the release process.

> These document types are specific to web-based software, so your mileage may vary.

##### Difficult to Write Before the Release

* For new menus, I write a [reference guide](https://diataxis.fr/reference/)
* For new forms, I write a [reference guide](https://diataxis.fr/reference/)
* For new tasks the user needs to perform to set up the new features, I write a [how-to guide](https://diataxis.fr/how-to-guides/)

##### Easy to Write Before the Release

* For new data objects, I write an [explanation document](https://diataxis.fr/explanation/)
* For tasks the user needs to complete as part of the upgrade, I write a [how-to guide](https://diataxis.fr/how-to-guides/)
* For new concepts introduced to the product, I write an [explanation document](https://diataxis.fr/explanation/) or a [tutorial](https://diataxis.fr/tutorials/)
* For new glossary entries, I write a definition

You can use this to make a list of tasks that your team must complete to support the release, divide them into what they can do before the release, and what must wait.

### Ask for Instances and Test Data

You won't be in control of this, but you can have some influence. Come up with an ask that suits your team. 

#### Instances to Ask for

I recommend that you ask for a "last" instance that hosts an instance of the last major version of the application. This instance doesn't need data, but it helps if it has the same data as your "current" instance.

I recommend that you ask for a durable documentation instance that holds your configurations from one version to the next. I typically create dedicated configurations for each feature or document I work on. That way I can come back to the configuration and re-capture screenshots and play with the feature without having to do lots of setup to get back where I was. 

I've been able to guard the staging instance and make sure my configurations don't get destroyed during releases, but haven't achieved anything beyond that.

#### Best Case Scenario

Your best case scenario is to get Engineering support to create scripts that builds all the configurations you need for documentation. This is a common task performed by test Engineers. I do it with my product all the time. I have a set of scripts that I use to build up configurations for test. This support will set you up with the best chances for success.

### How to Find the Changes

Every release has bug fixes, useability improvements, and behavioral changes sprinkled in with the major feature. There's a new checkbox here, a removed field there, a new comment on a table, or a minor behavioural change.

If you've done a release you'll know it's difficult to streamline this process. You just have to brute force it, and open the old document, or the old version and go through everything. Spoiler: you're going to miss stuff, and hate the process.

#### The "Easy" Way

If you start with consistent full-document screenshots of every page in the product, and run them through a visual regression test (using [ImageMagick Compare](https://imagemagick.org/), [Pixelmatch](https://github.com/mapbox/pixelmatch), or something similar), you'll basically have a list of every change in the UI. For every image that fails the diff check, review the change, update your screenshot, and update the relevant documentation.

> Hint: ask for access to the router, it will tell you what endpoints you need to cover.

Because this the most efficient practice we've found for locating application changes, we've implemented screenshot diffs for every image collected in the alpha version of [UserDocs](https://user-docs.com/), along with an approval process that lets you control writing the image to your final repo. The beta release will include features like new review tools (side-by-side, diffs, and swipe comparison), scoring thresholds (how different the image must be to trigger the alert), will offload the image comparison process to your local machine, and more.

### How to Pull Ahead on Screenshots

Screenshots are one of the most challenging tasks to perform before the release. It's painful to collect a large set of screenshots before all the visual and structural parts of the release are complete. New menu buttons, or appearance changes can invalidate all your work. Nothing hurts productivity and morale during the release like recreating all your screenshots.

#### Crop Judiciously

If you're doing manual screenshots, include just the part of the UI that's necessary for the document. If you're doing a form, put just the form in the screenshot. If you're doing a menu, just the menu. Avoid including unnecessary UI elements like sidebars and navigation menus. If the element is common to the entire application, it shouldn't go in every screenshot. Always taking the full screen, or the full viewport is asking for trouble.

#### Annotate as Late as Possible

If you annotate your screenshots, start with placeholders in your documentation. It takes less time to just grab screenshots and include them in documentation, than it does to post-edit and annotate the images. If you must get screenshots before the release, add them un-edited to your documentation. You can use those images for annotation if nothing changes. If the UI changes, you won't have to do as much work to recreate the screenshots.

#### Set up Screenshot Automation

The best part about screenshot automation is that you are spending your effort telling a computer how to collect your screenshot. Instead of collecting the screenshot, you can run the script at any time to recollect the screenshot. 

Screenshot automation uses basic web technology. It navigates a browser to a URL, interacts with some elements based on [CSS](https://www.w3schools.com/cssref/css_selectors.asp) or [XPath](https://www.w3schools.com/xml/xpath_syntax.asp) selectors, and takes a screenshot of the viewport of the browser, the entire document, or an element on the page (located by a selector). 

If there are minor visual changes, the scripts you write should be able to run as-is. If there are major structural changes to the page, you will need to change the script for it to run.

It's possible to use scripts to annotate images before collection, using simple JavaScript and CSS, eliminating the need for post-editing after screenshot collection. 

If you want to build your own screenshot automation, watch [the UserDocs blog](https://user-docs.com/blog) for tutorials and tips.

### How UserDocs Helps Streamline the Release Process

[UserDocs](https://user-docs.com/) implements some of the best practices described in this post. UserDocs makes it easy for non-technical users to automatically collect screenshots from web apps without writing code. It implements visual regression testing out of the box, and offers an approval workflow that allows users to make good decisions about when to publish changes to screenshots. 

UserDocs helps technical writers to have the smoothest release process of their careers. 

Instead of hunting through hundreds of web pages to locate and document changes, you start with a list of screenshots that failed the visual regression test. Just review the actual changes, update your documentation, and approve the new screenshot when you're ready.
