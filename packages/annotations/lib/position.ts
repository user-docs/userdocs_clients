export function absolutePositionElement(element, targetElement) {
  const box = targetElement.getBoundingClientRect();
  element.style.top = box.top
  element.style.left = box.left
  return element
}
  
export function adjustElementAbsolutePosition(element, xOffset, yOffset) {
  const computedStyle = window.getComputedStyle(element)
  element.style.top = `${parseInt(computedStyle.top) + xOffset}px`
  element.style.left = `${parseInt(computedStyle.left) + yOffset}px`
  return element
}

export function adjustElementRelativePosition(element, targetElement, xOffset, yOffset) {
  const elementStyle = window.getComputedStyle(element)
  const parentRect = targetElement.getBoundingClientRect()
  if (xOffset) {
    var finalLeft
    const percentAdjustment = ( xOffset / parentRect.width ) * 100
    if (element.style.left) finalLeft = parseInt(element.style.left) + percentAdjustment
    else finalLeft = percentAdjustment
    console.log(`Performing an x offset of ${elementStyle.left + xOffset}px. Left will be ${finalLeft}`)
    element.style.left = `${finalLeft}%`
  }
  if (yOffset) {
    var finalTop
    const percentAdjustment = ( yOffset / parentRect.height ) * 100
    console.log(element.style.top)
    if (element.style.top) finalTop = parseInt(element.style.top) + percentAdjustment
    else finalTop = percentAdjustment
    console.log(`Performing an y offset of ${elementStyle.top + yOffset}px. Top will be ${finalTop}`)
    element.style.top = `${finalTop}%`
  }
  return element
}