UserDocs will inject CSS into the automated browser every time it opens a new browser. This CSS is important because:

* Disables animations, which can cause your screenshots to be flaky, and show diffs when the UI hasn't changed.
* Disables scrollbars, which can be disabled by automation frameworks during screenshots, causing placed annotations to be offset, and false diffs.
* Styles the annotations that UserDocs places on the page, which controls the appearance of your screenshots.  

This document will review the recommended default CSS, and the reasons for each clause in the default styles.

## Disable Animations

Blocks transitions and animations in the target browser. Animations and transitions should be avoided during screenshot capture. They cause inconsistencies that will produce red herrings in the image diff workflow.

```
*,
*::after,
*::before {
  transition-delay: 0s !important;
  transition-duration: 0s !important;
  animation-delay: -0.0001s !important;
  animation-duration: 0s !important;
  animation-play-state: paused !important;
  caret-color: transparent !important;
}
```

## Disable Scrollbars

Disables the scrollbars in the browser. Prevents offset of annotations. Ensures consistent viewport and screenshot collection.

```
body::-webkit-scrollbar {
  display: none;
}
```

## Locator Styling

The locator is set to 0px / 0px so it's not visible on the page. Relative position is used so that the locator moves with the content when the page scrolls.

```

.userdocs-locator{
  position: relative; 
  width: 0;
  height: 0;
}
```

## Mask Styling


Absolute position is used so that the mask doesn't collide with or rearrange other elements on the page. `display: flex` isn't necessary but makes it nice when working with flex layouts.

```
.userdocs-mask{
  position: absolute;
  display: flex;
}
```

## Badge Styling

See Martin Bing's excellent article on [How to create: The Perfect Badge](https://medium.com/@MartinBing/css-how-to-create-the-perfect-badge-4b5239f10a8a?) to see my inspiration for this class.

* **float: left** -- Makes the badge float to the left of the mask, doesn't always work
* **display: inline-flex** -- Flex is not required, but makes annotations play nicer with flex layouts
* **justify-content: center; & align-items: center;** -- Pushes the text to the center of the badge
* **position: absolute;** -- Prevents rearrangement of other on-page elements
* **transform:translate(-50%, -50%);** -- Centers the badge around the point it's placed on
* **color & background-color** -- Colors the text on the badge, and the badge itself (respectively)
* **font-size** -- Defines the default font size, the size of the badge changes based on this value 
* **border-radius: 50%;** -- Makes the badge a circle

See Martin's article for more explanation

```
.userdocs-badge {
  float: left; 
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  transform:translate(-50%, -50%);
  color: #fff;
  background-color: #7FBE7F;
  font-size: 24px;
  border-radius: 50%;
  padding: 10px;
  min-width: 1em; 
  padding: .3em; 
  line-height: 0;
}
.userdocs-badge::after {
  content: "";
  display: block;
  padding-bottom: 100%;
}
```

## Outline Styling

We just set the outline properties, and use absolute positioning.

```
.userdocs-outline{
  position: absolute;
  outline-width: 4px;
  outline-color: #7FBE7F;
  outline-style: solid;
}
```
