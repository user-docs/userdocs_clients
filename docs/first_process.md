Once you've set up your account, and downloaded the UserDocs application, you're ready to start working on your first process. 

Before interacting with the UserDocs application, pick your first screenshot to reproduce. Go to your documentation, and find an easy screenshot. For your first one, pick a screenshot that doesn't have annotations, and doesn't require any automation. You shouldn't need to click on something to expand it, or fill a form field.

1. Navigate to the [Process Menu](process_menu.md). 
2. Create a new process using the [Process Form](process_form.md), and click on it. This will open the [New Step Form](step_form_new.md). 
3. Create a [Navigation Step](step_form_navigate.md), and configure it to navigate to the URL of the page you wish to capture a screenshot of.
4. Create a [Set Size Explicit Step](step_form_set_size_explicit.md), and set it to the width and height of the screenshot you are reproducing.
5. Create a Full Screen Screenshot Step, and give the screenshot the same name as the screenshot you are reproducing.

As you create each step, run it individually using the [Run Step button on the Step Menu](step_menu.md) to make sure it's functioning correctly. When you finish making the process, run the whole process using the [Execute Process button on the Step Menu](step_menu.md) to make sure it executes correctly.

Once the entire process has executed at least once, click the [Edit Button on your Full Step Screenshot](step_menu.md). It will display a preview of the screenshot in the [Screenshot Subform](screenshot_subform_reference.md). Run the process several times, and make sure UserDocs doesn't detect a diff in your screenshot to ensure the process is capturing the screenshot consistently.

Once you've done this, you should have a running process. Next, you should do one of these things:

* Add an annotation to this screenshot
* Pick another screenshot from your documentation to reproduce