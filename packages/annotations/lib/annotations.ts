import { locator as styleLocator, badge as styleBadge, outline as styleOutline } from "./style"
import { absolutePositionElement, adjustElementAbsolutePosition } from "./position"
declare global { interface Window { active_annotations: Array<any> } }

'use strict';

export function applyAnnotation(annotation, element) {
  if (!annotation.annotationType) throw new Error("annotation has no type")
  if (!annotation.annotationType.name) throw new Error("annotation type has no name")
  const apply = index[annotation.annotationType.name]
  apply(annotation, element)
}

export const index = {
  "Badge Blur": badgeBlur,
  "Badge": badge,
  "Outline": outline,
  "Badge Outline": badgeOutline,
  "Blur": blur,
  "Throw": () => { throw new Error("Expected Failure") }
}

export function badgeBlur(annotation, elementToAnnotate) {
  badge(annotation, elementToAnnotate)
  elementToAnnotate.style.textShadow = "rgba(0, 0, 0, 0.5) 0px 0px 5px";
  elementToAnnotate.style.color = "transparent";
}
 
export function badge(annotation, elementToAnnotate) {
  var locatorElement: Element
  var maskElement: Element
  var badgeElement: Element
  const xOrientation = annotation.xOrientation;
  const yOrientation = annotation.yOrientation;
  const size = annotation.size;
  const labelText = annotation.label;
  const color = annotation.color;
  const xOffset = annotation.xOffset;
  const yOffset = annotation.yOffset;
  const fontSize = annotation.fontSize;
  const annotationId = annotation.id;

  locatorElement = createLocator(annotationId)
  insertAbsolute(locatorElement)
  locatorElement = styleLocator(locatorElement, elementToAnnotate)
  absolutePositionElement(locatorElement, elementToAnnotate)

  maskElement = createMask(annotationId)
  locatorElement.append(maskElement)

  badgeElement = createBadge(annotationId, labelText)
  badgeElement = styleBadge(badgeElement, elementToAnnotate, size, fontSize, color, xOrientation, yOrientation)
  adjustElementAbsolutePosition(badgeElement, xOffset, yOffset)

  maskElement.append(badgeElement); 
  addToActiveAnnotations(locatorElement)
}

export function outline(annotation, elementToAnnotate) {
  var locatorElement: Element
  var outlineElement: Element
  const annotationId = annotation.id;
  const color = annotation.color;
  const thickness = annotation.thickness;

  locatorElement = createLocator(annotationId)
  insertAbsolute(locatorElement)
  locatorElement = styleLocator(locatorElement, elementToAnnotate)
  absolutePositionElement(locatorElement, elementToAnnotate)

  outlineElement = createMask(annotationId)
  locatorElement.append(outlineElement)

  outlineElement = styleOutline(elementToAnnotate, outlineElement, color, thickness)
  addToActiveAnnotations(locatorElement)
}

export function badgeOutline(annotation, elementToAnnotate) {
  var locatorElement: Element
  var outlineElement: Element
  var badgeElement: Element
  const xOrientation = annotation.xOrientation;
  const yOrientation = annotation.yOrientation;
  const size = annotation.size;
  const labelText = annotation.label;
  const color = annotation.color;
  const xOffset = annotation.xOffset;
  const yOffset = annotation.yOffset;
  const fontSize = annotation.fontSize;
  const annotationId = annotation.id;
  const thickness = annotation.thickness;

  locatorElement = createLocator(annotationId)
  insertAbsolute(locatorElement)
  locatorElement = styleLocator(locatorElement, elementToAnnotate)
  absolutePositionElement(locatorElement, elementToAnnotate)

  outlineElement = createMask(annotationId)
  locatorElement.append(outlineElement)
  outlineElement = styleOutline(elementToAnnotate, outlineElement, color, thickness)

  badgeElement = createBadge(annotationId, labelText)
  badgeElement = styleBadge(badgeElement, elementToAnnotate, size, fontSize, color, xOrientation, yOrientation)

  outlineElement.append(badgeElement); 
  addToActiveAnnotations(locatorElement)
}

function createLocator(annotationId) {
  var element = document.createElement('div');
  element.id = `userdocs-annotation-${annotationId}-locator`
  element.classList.add("userdocs-locator")
  return element
}

function createMask(annotationId) {
  var element = document.createElement('div');
  element.id = `userdocs-mask-${annotationId}-mask`
  element.classList.add("userdocs-mask")
  return element
}

function createBadge(annotationId, labelText) {
  var element = document.createElement('span');
  element.id = `userdocs-annotation-${annotationId}-badge`
  element.textContent = labelText;
  element.classList.add("userdocs-badge")
  return element
}

function addToActiveAnnotations(element) {
  if (window.active_annotations) window.active_annotations.push(element);
  else window.active_annotations = [ element ]
}

function insertAbsolute(elementToInsert) {
  document.body.appendChild(elementToInsert)
}
