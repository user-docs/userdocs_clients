export function absolutePositionElement(element, targetElement) {
  const box = targetElement.getBoundingClientRect();
  element.style.top = `${parseInt(box.top)}px`
  element.style.left = `${parseInt(box.left)}px`
  return element
}

export function relativePositionElement(element, parentElement) {
  const parentStyle = window.getComputedStyle(parentElement)
  const leftOffset = parseInt(parentStyle.marginLeft) + parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.borderLeftWidth)
  const topOffset = parseInt(parentStyle.marginTop) + parseInt(parentStyle.paddingTop) + parseInt(parentStyle.borderTopWidth)

  element.style.left = `-${leftOffset}px`;
  element.style.top = `-${topOffset}px`;
  return element
}

export function copySize(element, targetElement) {
  const box = targetElement.getBoundingClientRect();
  element.style.width = `${parseInt(box.width)}px`
  element.style.height = `${parseInt(box.height)}px`
  return element
}
  
export function adjustElementAbsolutePosition(element, xOffset, yOffset) {
  console.log(`Adjusting element position to ${xOffset}px ${yOffset}px`)
  if (xOffset) element.style.top = `${xOffset}px`
  if (yOffset) element.style.left = `${yOffset}px`
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