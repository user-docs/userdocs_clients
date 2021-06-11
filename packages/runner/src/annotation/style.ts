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

function badge(element: HTMLSpanElement, size: number, fontSize: number, color: string, xOrientation: string, yOrientation: string) {
  const logString = `
    Creating a badge element, with width: ${element.style.width}, height: ${element.style.height}, font size: 
  `
  if(size) element.style.width = (2 * size).toString() + 'px';
  if(size) element.style.height = (2 * size).toString() + 'px';
  if(fontSize) element.style.fontSize = fontSize.toString() + 'px';
  if(color) element.style.background = color;
  if(xOrientation == 'L') element.style.float = 'left'
  else if(xOrientation == 'M') element.style.left = '50%'
  else if(xOrientation == 'R') element.style.float = 'right'
  if(yOrientation == 'M') element.style.top = '50%'
  else if(yOrientation == 'B') element.style.top = '100%'
  return element;
}

function outline(elementToOutline: HTMLSpanElement, element: HTMLSpanElement, color: string, thickness: number) {
  const rect = elementToOutline.getBoundingClientRect();
  const parentStyle = window.getComputedStyle(elementToOutline)
  const leftOffset = parseInt(parentStyle.marginLeft) + parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.borderLeftWidth)
  const topOffset = parseInt(parentStyle.marginTop) + parseInt(parentStyle.paddingTop) + parseInt(parentStyle.borderTopWidth)
  
  element.style.width = Math.round(rect.width).toString() + 'px'
  element.style.height = Math.round(rect.height).toString() + 'px'
  if (color) element.style.outlineColor = color
  if (thickness) element.style.outlineWidth = `${thickness}px`;
  element.style.outlineStyle = 'solid'
  element.style.left = `-${leftOffset}px`;
  element.style.top = `-${topOffset}px`;

  return element
}