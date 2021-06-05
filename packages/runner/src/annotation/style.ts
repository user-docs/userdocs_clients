export const StyleFunctionsText: any  = {
  styleLabel: label.toString(),
  styleWrapper: wrapper.toString(),
  styleBadge: badge.toString(),
  styleOutline: outline.toString()
}

function badge(element: HTMLSpanElement, size: number, fontSize: number, color: string) {
  if(!size) throw new Error('Badge size not entered')
  if(!fontSize) throw new Error('Font size not entered')
  if(!color) throw new Error('Badge Color not entered')
  element.style.position = 'relative';
  element.style.display = 'inline-table';
  element.style.width = (2 * size).toString() + 'px';
  element.style.height = (2 * size).toString() + 'px';
  element.style.borderRadius = '50%';
  element.style.fontSize = fontSize.toString() + 'px';
  element.style.textAlign = 'center';
  element.style.background = color;

  return element;
}

function wrapper(element: HTMLDivElement, rect: DOMRect, size: number, xOffset: number, yOffset: number, xOrientation: string, yOrientation: string) {
  const x_calcs: { [key: string]: string } = {
    L: Math.round(rect.left - size + xOffset).toString() + 'px',
    M: Math.round(rect.left + rect.width/2 - size + xOffset).toString() + 'px',
    R: Math.round(rect.right - size + xOffset).toString() + 'px'
  }
  const y_calcs: { [key: string]: string } = {
    T: Math.round(rect.top - size + yOffset).toString() + 'px',
    M: Math.round(rect.bottom - rect.height/2 - size + yOffset).toString() + 'px',
    B: Math.round(rect.bottom - size + yOffset).toString() + 'px'
  }

  const x = x_calcs[xOrientation]
  const y = y_calcs[yOrientation]
  const z_index = 999999

  element.style.display = 'static';
  element.style.justifyContent = 'center';
  element.style.alignItems = 'center';
  element.style.minHeight = '';
  element.style.position = 'fixed';
  element.style.top = y;
  element.style.left = x;
  element.style.zIndex = z_index.toString();

  return element
}

function label(element: HTMLSpanElement, size: number, fontSize: number, labelText: string) {
  element.style.position = 'relative';
  element.style.top = ((size * 2 - fontSize) / 2).toString() + 'px';
  element.textContent = labelText;
  element.style.color = 'white';

  return element;
}

function outline(elementToOutline: HTMLSpanElement, element: HTMLSpanElement, color: string, thickness: number) {
  const rect = elementToOutline.getBoundingClientRect();
  const zIndex = 999998
  
  element.style.position = 'fixed';
  element.style.width = Math.round(rect.width).toString() + 'px'
  element.style.height = Math.round(rect.height).toString() + 'px'
  element.style.outline = color + ' solid ' + thickness + 'px';
  element.style.top = Math.round(rect.top).toString() + 'px';
  element.style.left = Math.round(rect.left).toString() + 'px';
  element.style.zIndex = zIndex.toString();

  return element
}