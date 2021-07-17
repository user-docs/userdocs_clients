UserDocs automatically annotates HTML pages so technical writers and content creators don't have to manually add annotations to screenshots before publishing documentation. Automatic annotations make it possible to collect and update higher volumes of screenshots without manual intervention.

Annotations are graphic elements, which are added to screenshots. The purpose of an annotation is to correlate UI elements with text instructions or explanations. Annotated images are commonly used in software documentation, because they help the user to correlate what they see on the screen with text descriptions, or instructions. 

Annotations can serve many different purposes, such as:

* Direct a users attention to a specific portion of the UI
* Indicate what portion of the ui a user should interact with
* Explain a portion of the ui
* Correlate elements of the ui with text content in a document  
* Obscure elements of the UI

In UserDocs, Annotations represent one of these graphic elements. Annotations are always associated with one or more elements on the page, because they are added to, or modify existing elements. UserDocs adds annotations to the existing page using Javascript. The annotations are primarily styled with CSS that's injected onto the page by UserDocs, or is added to the application by your development team.

Each annotation has a type, which defines what kind of graphic element will be rendered on the page. Each annotation has a number of settings based on the type, which will render how the annotation is placed and styled. In most cases, you won't need to fill in these fields, because your annotation will be placed and styled according to your CSS.