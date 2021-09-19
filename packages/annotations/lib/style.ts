export function badge(element, size: number, fontSize: number, color: string, xOrientation: string, yOrientation: string) {
  const logString = `Styling a badge element, with width: ${element.style.width}, height: ${element.style.height}, font size: `
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
  element.style.zIndex = '9999'
  return element;
}

export function outline(elementToOutline, element, color: string, thickness: number) {
  const rect = elementToOutline.getBoundingClientRect();
  //const parentStyle = window.getComputedStyle(elementToOutline)
  //const leftOffset = parseInt(parentStyle.marginLeft) + parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.borderLeftWidth)
  //const topOffset = parseInt(parentStyle.marginTop) + parseInt(parentStyle.paddingTop) + parseInt(parentStyle.borderTopWidth)
  
  element.style.width = Math.round(rect.width).toString() + 'px'
  element.style.height = Math.round(rect.height).toString() + 'px'
  if (color) element.style.outlineColor = color
  if (thickness) element.style.outlineWidth = `${thickness}px`;
  element.style.zIndex = '9999'
  //element.style.outlineStyle = 'solid'
  // element.style.left = `-${leftOffset}px`;
  // element.style.top = `-${topOffset}px`;

  return element
}

export function locator(element) {
  element.style.zIndex = '-9999'
  return element
}

export function mask(element) {
  element.style.zIndex = '-9999'
  return element
}