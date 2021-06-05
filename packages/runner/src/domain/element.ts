
import { Strategy } from './strategy'

export interface Element {
  id: string,
  name: string,
  selector: string,
  strategy: Strategy
}