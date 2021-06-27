# Annotation Mask

To place annotations without disrupting the flow and spacing of the existing document, UserDocs uses the annotation mask. The mask overlays an invisible element over the target element, and places the annotation on or around that mask.

To prevent disruption to the document, UserDocs first creates a locator. UserDocs places the locator adjacent to the target element according to the normal flow of the document using `insertAdjacentElement('beforebegin', locatorElement)`. The locator element is `0px/0px` so that it doesn't disrupt the spacing the document (shown as `red 5px/5px` in top left corner of the figure). The locator uses `relative` positioning so that it will move with the document if scrolling occurs.

UserDocs places the mask as a child of the locator. UserDocs sets the `top` and `left` properties so that the mask's appropriate corner is on the locator. The mask sits directly over the target element (including the margin). The mask has diagonal purple strips in the figure.  It doesn't cover the target entirely due to the size of the locator in the example.

![Annotation Mask](images/annotation_mask.png)

[See this example in a codepen](https://codepen.io/johns10/pen/yLbBPOd)