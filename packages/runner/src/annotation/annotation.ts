import { Step } from '../domain/step'

declare global {
  interface Window { active_annotations: Array<any> }
}

interface AnnotationHandler { [ key: string ]: Function }

export const annotationHandlers: AnnotationHandler = {
  "Badge": (step: Step, elementToAnnotate: HTMLElement, style: { [key: string]: string }) => {
    // Get vars for these elements
    console.log("Applying Badge Annotation")
    const xOrientation = step.annotation.xOrientation;
    const yOrientation = step.annotation.yOrientation;
    const size = step.annotation.size;
    const labelText = step.annotation.label;
    const color = step.annotation.color;
    const xOffset = step.annotation.xOffset;
    const yOffset = step.annotation.yOffset;
    const fontSize = step.annotation.fontSize;
    const annotationId = step.annotation.id;

    var locatorElement = document.createElement('div');

    // Append locator to parent
    elementToAnnotate.prepend(locatorElement);

    locatorElement.id = `userdocs-annotation-${annotationId}-locator`
    locatorElement.classList.add("userdocs-locator")
    const styleLocator = new Function(`return ${style.styleLocator}`)()
    locatorElement = styleLocator(locatorElement, elementToAnnotate)

    // Position Locator
    const parentRect = elementToAnnotate.getBoundingClientRect();
    const elementRect = locatorElement.getBoundingClientRect();
    const parentStyle = window.getComputedStyle(elementToAnnotate)
    const locatorStyle = window.getComputedStyle(locatorElement)
    const topAdjustment = parentRect.top - elementRect.top
    const leftAdjustment = parentRect.left - elementRect.left
    
    console.log(`
      Locator Top is ${elementRect.top}. 
      Parent Top is ${parentRect.top}. 
      Margin Top is ${parentStyle.marginTop}.  
      Padding top is ${parseInt(parentStyle.paddingTop)}. 
      Top adjustment of ${topAdjustment}
    `)
    console.log(`
      Locator Left is ${elementRect.left}. 
      Parent Left is ${parentRect.left}. 
      Margin Left is ${parentStyle.marginLeft}.  
      Padding left is ${parseInt(parentStyle.paddingLeft)}. 
      Left adjustment of ${leftAdjustment}
    `)
    locatorElement.style.top = `${parseInt(locatorStyle.top) + topAdjustment}px`
    locatorElement.style.left = `${parseInt(locatorStyle.left) + leftAdjustment}px`
    // End Position Locator

    var maskElement = document.createElement('div');
    maskElement.id = `userdocs-mask-${annotationId}-mask`
    maskElement.classList.add("userdocs-mask")
    const styleMask = new Function(`return ${style.styleMask}`)()
    maskElement = styleMask(maskElement, elementToAnnotate)

    // Append mask to locator
    locatorElement.append(maskElement);
  
    var badgeElement = document.createElement('span');
    badgeElement.id = `userdocs-annotation-${annotationId}-badge`
    badgeElement.textContent = labelText;
    badgeElement.classList.add("userdocs-badge")
    const styleBadge = new Function(`return ${style.styleBadge}`)()
    badgeElement = styleBadge(badgeElement, size, fontSize, color, xOrientation, yOrientation, xOffset, yOffset);
  
    try {
      maskElement.append(badgeElement); 
      badgeElement.style.zIndex = '999'
      if (window.active_annotations) {
        window.active_annotations.push(locatorElement);
      } else {
        window.active_annotations = [ locatorElement ]
      }
      return step
    } catch(error) {
      throw(error)
    }
  },
  "Outline": (step: Step, elementToAnnotate: HTMLElement, style: { [key: string]: string }) => {
    const annotationId = step.annotation.id;
    const color = step.annotation.color;
    const thickness = step.annotation.thickness;

    var locatorElement = document.createElement('div');


    locatorElement.id = `userdocs-annotation-${annotationId}-locator`
    locatorElement.classList.add("userdocs-locator")
    elementToAnnotate.prepend(locatorElement);

    const styleLocator = new Function(`return ${style.styleLocator}`)()
    locatorElement = styleLocator(locatorElement, elementToAnnotate)

    const parentRect = elementToAnnotate.getBoundingClientRect();
    const elementRect = locatorElement.getBoundingClientRect();
    const topAdjustment = parentRect.top - elementRect.top
    const leftAdjustment = parentRect.left - elementRect.left
    console.log(`Top adjustment of ${topAdjustment}`)
    console.log(`Left adjustment of ${leftAdjustment}`)
    locatorElement.style.top = `${parseInt(locatorElement.style.top) + topAdjustment}px`
    locatorElement.style.left = `${parseInt(locatorElement.style.left) + leftAdjustment}px`

    var outlineElement = document.createElement('div');
    outlineElement.id = `userdocs-annotation-${annotationId}-outline`
    outlineElement.classList.add("userdocs-outline")
    locatorElement.append(outlineElement)

    const styleOutline = new Function(`return ${style.styleOutline}`)()
    outlineElement = styleOutline(elementToAnnotate, outlineElement, color, thickness)
  
    try {
      if (window.active_annotations) {
        window.active_annotations.push(outlineElement);
      } else {
        window.active_annotations = [ outlineElement ]
      }
      return step
    } catch(error) {
      throw(error)
    }
  },
  "Badge Outline": (step: Step, elementToAnnotate: HTMLElement, style: { [key: string]: string }) => {
    const thickness = step.annotation.thickness;
    const xOrientation = step.annotation.xOrientation
    const yOrientation = step.annotation.yOrientation
    const size = step.annotation.size
    const labelText = step.annotation.label
    const color = step.annotation.color
    const xOffset = step.annotation.xOffset
    const yOffset = step.annotation.yOffset
    const fontSize = step.annotation.fontSize;
    const annotationId = step.annotation.id;
  
    var locatorElement = document.createElement('div');
    locatorElement.id = `userdocs-annotation-${annotationId}-locator`
    locatorElement.classList.add("userdocs-locator")
    const styleLocator = new Function(`return ${style.styleLocator}`)()
    locatorElement = styleLocator(locatorElement, elementToAnnotate)

    var outlineElement = document.createElement('div');
    outlineElement.id = `userdocs-annotation-${annotationId}-outline`
    outlineElement.classList.add("userdocs-outline")
    const styleOutline = new Function(`return ${style.styleOutline}`)()
    outlineElement = styleOutline(elementToAnnotate, outlineElement, color, thickness)

    var maskElement = document.createElement('div');
    maskElement.id = `userdocs-mask-${annotationId}-mask`
    maskElement.classList.add("userdocs-mask")
    const styleMask = new Function(`return ${style.styleMask}`)()
    maskElement = styleMask(maskElement, elementToAnnotate)
  
    var badgeElement = document.createElement('span');
    badgeElement.id = `userdocs-annotation-${annotationId}-badge`
    badgeElement.textContent = labelText;
    badgeElement.classList.add("userdocs-badge")
    const styleBadge = new Function(`return ${style.styleBadge}`)()
    badgeElement = styleBadge(badgeElement, size, fontSize, color, xOrientation, yOrientation, xOffset, yOffset);
  
    try {
      elementToAnnotate.prepend(locatorElement);
      locatorElement.append(outlineElement)
      locatorElement.append(maskElement); 
      maskElement.appendChild(badgeElement);
      if (window.active_annotations) {
        window.active_annotations.push(locatorElement);
      } else {
        window.active_annotations = [ locatorElement ]
      }
      return step
    } catch(error) {
      throw(error)
    }
  },
  "Blur": (step: Step, element: HTMLElement, style: { [key: string]: string }) => {
    element.style.textShadow = "rgba(0, 0, 0, 0.5) 0px 0px 5px";
    element.style.color = "transparent";
    return step
  },
  "Throw": () => { throw new Error("Expected Failure") }
}