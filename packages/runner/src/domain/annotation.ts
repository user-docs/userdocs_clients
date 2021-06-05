
import { AnnotationType } from './annotationType'

export interface Annotation {
  id: string,
  name: string,
  label: string,
  xOrientation: string,
  yOrientation: string,
  size: number,
  color: string,
  thickness: number,
  xOffset: number,
  yOffset: number,
  fontSize: number,
  font_color: string,
  annotationType: AnnotationType
}