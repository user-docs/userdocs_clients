# Features

## Runs Automation Locally

It's running on your desktop, so all calls from your machine use your local network. Run processes against your local machines, or resources on your LAN. With UserDocs Desktop, you're not restricted to web-accessible resources.

## Preserves Browser Settings

Creates and leverages a local Chrome data directory. Preserves cookies, credentials, installed extensions, and settings you configure on your local machine. Work in the same environment to speed up and make your automation experience more ergonomic.

## Local Storage

Store images locally to a configurable directory on your computer, as well as the AWS bucket. Point this directory into your documentation project's Github directory and watch the images in your documents update automatically as you run processes on your local machine.

## UserDocs Runner

UserDocs Desktop is the platform that delivers the UserDocs Runner to your local machine. The Runner is responsible for initializing an automated browser, executing jobs processes and steps, and reporting status and errors back to UserDocs Web. The Runner is a portable client that communicates to the front end of UserDocs Web, and the back end through the API. The runner leverages existing automation frameworks, like puppeteer to automate browsers locally. It can execute all the steps that are necessary to navigate to pages, set the scene for screenshots, collect them, and send the results back to UserDocs Web.
