function createAnnotation(type, annotationId, labelText) {
  if (type == 'badge') createBadgeAnnotation(annotationId, labelText)
}

function createBadgeAnnotation(annotationId, labelText) {
  var locatorElement = createLocator(annotationId)
  var maskElement = createMask(annotationId)
  var badgeLocator = createBadgeLocator(annotationId)
  var badgeElement = createBadge(annotationId, labelText)
  insertAbsolute(locatorElement)
  locatorElement.append(maskElement)
  maskElement.append(badgeLocator); 
  badgeLocator.append(badgeElement); 
  return locatorElement
}

function createLocator(annotationId) {
  var element = document.createElement('div');
  element.id = `userdocs-annotation-${annotationId}-locator`
  element.classList.add("userdocs-locator")
  return element
}

function createBadgeLocator(annotationId) {
  var element = document.createElement('div');
  element.id = `userdocs-badge-${annotationId}-locator`
  element.classList.add("userdocs-locator")
  return element
}

function createMask(annotationId) {
  var element = document.createElement('div');
  element.id = `userdocs-annotation-${annotationId}-mask`
  element.classList.add("userdocs-mask")
  return element
}

function createOutline(annotationId) {
  var element = document.createElement('div');
  element.id = `userdocs-annotation-${annotationId}-outline`
  element.classList.add("userdocs-outline")
  return element
}

function createBadge(annotationId, labelText) {
  var element = document.createElement('span');
  element.id = `userdocs-annotation-${annotationId}-badge`
  element.textContent = labelText;
  element.classList.add("userdocs-badge")
  return element
}
  
function insertAbsolute(elementToInsert) {
  document.body.prepend(elementToInsert)
}

window.createAnnotation = createAnnotation