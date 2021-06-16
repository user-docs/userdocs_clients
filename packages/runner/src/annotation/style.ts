export const StyleFunctionsText: any  = {
  styleBadge: badge.toString(),
  styleOutline: outline.toString(),
  styleLocator: locator.toString(),
  styleMask: mask.toString()
}

function locator(element: HTMLSpanElement, parentElement: HTMLSpanElement) {
  const parentStyle = window.getComputedStyle(parentElement)
  const leftOffset = parseInt(parentStyle.marginLeft) + parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.borderLeftWidth)
  const topOffset = parseInt(parentStyle.marginTop) + parseInt(parentStyle.paddingTop) + parseInt(parentStyle.borderTopWidth)

  element.style.left = `-${leftOffset}px`;
  element.style.top = `-${topOffset}px`;
  return element
}

function mask(element: HTMLSpanElement, parentElement: HTMLSpanElement) {
  const parentRect = parentElement.getBoundingClientRect();
  element.style.width = `${parentRect.width}px`
  element.style.height = `${parentRect.height}px`
  return element
}

function badge(element: HTMLSpanElement, parentElement: HTMLSpanElement, size: number, fontSize: number, color: string, xOrientation: string, yOrientation: string, xOffset: number, yOffset: number) {
  const logString = `
    Styling a badge element, with width: ${element.style.width}, height: ${element.style.height}, font size: 
  `
  if(size) element.style.width = (2 * size).toString() + 'px';
  if(size) element.style.height = (2 * size).toString() + 'px';
  if(fontSize) element.style.fontSize = fontSize.toString() + 'px';
  if(color) element.style.background = color;
  if(xOrientation == 'L') element.style.left = '0%'
  else if(xOrientation == 'M') element.style.left = '50%'
  else if(xOrientation == 'R') element.style.left = '100%'
  if(yOrientation == 'T') element.style.top = '0%'
  else if(yOrientation == 'M') element.style.top = '50%'
  else if(yOrientation == 'B') element.style.top = '100%'

  const elementStyle = window.getComputedStyle(element)
  const parentRect = parentElement.getBoundingClientRect()

  if (xOffset) {
    var finalLeft
    const percentAdjustment = ( xOffset / parentRect.width ) * 100
    if (element.style.left) { 
      finalLeft = parseInt(element.style.left) + percentAdjustment
    } else {
      finalLeft = percentAdjustment
    }
    console.log(`Performing an x offset of ${elementStyle.left + xOffset}px. Left will be ${finalLeft}`)
    element.style.left = `${finalLeft}%`
  }
  if (yOffset) {
    var finalTop
    const percentAdjustment = ( yOffset / parentRect.height ) * 100
    console.log(element.style.top)
    if (element.style.top) { 
      finalTop = parseInt(element.style.top) + percentAdjustment
    } else {
      finalTop = percentAdjustment
    }
    console.log(`Performing an y offset of ${elementStyle.top + yOffset}px. Top will be ${finalTop}`)
    element.style.top = `${finalTop}%`
  }

  return element;
}

function outline(elementToOutline: HTMLSpanElement, element: HTMLSpanElement, color: string, thickness: number) {
  const rect = elementToOutline.getBoundingClientRect();
  //const parentStyle = window.getComputedStyle(elementToOutline)
  //const leftOffset = parseInt(parentStyle.marginLeft) + parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.borderLeftWidth)
  //const topOffset = parseInt(parentStyle.marginTop) + parseInt(parentStyle.paddingTop) + parseInt(parentStyle.borderTopWidth)
  
  element.style.width = Math.round(rect.width).toString() + 'px'
  element.style.height = Math.round(rect.height).toString() + 'px'
  if (color) element.style.outlineColor = color
  if (thickness) element.style.outlineWidth = `${thickness}px`;
  //element.style.outlineStyle = 'solid'
  // element.style.left = `-${leftOffset}px`;
  // element.style.top = `-${topOffset}px`;

  return element
}