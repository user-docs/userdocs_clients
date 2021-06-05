import { Step } from '../domain/step'

declare global {
  interface Window { active_annotations: Array<any> }
}

interface AnnotationHandler { [ key: string ]: Function }

export const annotationHandlers: AnnotationHandler = {
  "Badge": (step: Step, elementToAnnotate: HTMLElement, style: { [key: string]: string }) => {
    // Get vars for these elements
    const xOrientation = step.annotation.xOrientation;
    const yOrientation = step.annotation.yOrientation;
    const size = step.annotation.size;
    const labelText = step.annotation.label;
    const color = step.annotation.color;
    const xOffset = step.annotation.xOffset;
    const yOffset = step.annotation.yOffset;
    const fontSize = step.annotation.fontSize;
    const annotationId = step.annotation.id;
  
    var badgeElement = document.createElement('span');
    badgeElement.id = `userdocs-annotation-${annotationId}-badge`
    badgeElement.classList.add("userdocs-badge")
    const styleBadge = new Function(`return ${style.styleBadge}`)()
    badgeElement = styleBadge(badgeElement, size, fontSize, color);
  
    var labelElement = document.createElement('span');
    labelElement.id = `userdocs-annotation-${annotationId}-label`
    labelElement.classList.add("userdocs-label")
    const styleLabel = new Function(`return ${style.styleLabel}`)()
    labelElement = styleLabel(labelElement, size, fontSize, labelText);
  
    const rect = elementToAnnotate.getBoundingClientRect();
    var wrapperElement = document.createElement('div');
    wrapperElement.id = `userdocs-annotation-${annotationId}-wrapper`
    wrapperElement.classList.add("userdocs-wrapper")
    const styleWrapper = new Function(`return ${style.styleWrapper}`)()
    wrapperElement = styleWrapper(wrapperElement, rect, size, xOffset, yOffset, xOrientation, yOrientation);
  
    try {
      document.body.appendChild(wrapperElement);
      wrapperElement.appendChild(badgeElement); 
      badgeElement.appendChild(labelElement);
      if (window.active_annotations) {
        window.active_annotations.push(wrapperElement);
      } else {
        window.active_annotations = [ wrapperElement ]
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

    var outlineElement = document.createElement('div');
    outlineElement.id = `userdocs-annotation-${annotationId}-outline`
    outlineElement.classList.add("userdocs-outline")
    const styleOutline = new Function(`return ${style.styleOutline}`)()
    outlineElement = styleOutline(elementToAnnotate, outlineElement, color, thickness)
  
    try {
      document.body.appendChild(outlineElement)
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
  
    var badgeElement = document.createElement('span');
    badgeElement.id = `userdocs-annotation-${annotationId}-badge`
    badgeElement.classList.add("userdocs-badge")
    const styleBadge = new Function(`return ${style.styleBadge}`)()
    badgeElement = styleBadge(badgeElement, size, fontSize, color);
  
    var labelElement = document.createElement('span');
    labelElement.id = `userdocs-annotation-${annotationId}-label`
    labelElement.classList.add("userdocs-label")
    const styleLabel = new Function(`return ${style.styleLabel}`)()
    labelElement = styleLabel(labelElement, size, fontSize, labelText);
  
    const rect = elementToAnnotate.getBoundingClientRect();
    var wrapperElement = document.createElement('div');
    wrapperElement.id = `userdocs-annotation-${annotationId}-wrapper`
    wrapperElement.classList.add("userdocs-wrapper")
    const styleWrapper = new Function(`return ${style.styleWrapper}`)()
    wrapperElement = styleWrapper(wrapperElement, rect, size, xOffset, yOffset, xOrientation, yOrientation);

    var outlineElement = document.createElement('div');
    outlineElement.id = `userdocs-annotation-${annotationId}-outline`
    outlineElement.classList.add("userdocs-outline")
    const styleOutline = new Function(`return ${style.styleOutline}`)()
    outlineElement = styleOutline(elementToAnnotate, outlineElement, color, thickness)
  
    try {
      document.body.appendChild(wrapperElement);
      document.body.appendChild(outlineElement)
      wrapperElement.appendChild(badgeElement); 
      badgeElement.appendChild(labelElement);
      if (window.active_annotations) {
        window.active_annotations.push(wrapperElement);
        window.active_annotations.push(outlineElement);
      } else {
        window.active_annotations = [ outlineElement, wrapperElement ]
      }
      return step
    } catch(error) {
      throw(error)
    }
  },
  "Blur": (step: Step, element: HTMLElement, style: { [key: string]: string }) => {
    element.style.textShadow = "0 0 5px rgba(0,0,0,0.5)";
    element.style.color = "transparent";
    return step
  },
  "Throw": () => { throw new Error("Expected Failure") }
}