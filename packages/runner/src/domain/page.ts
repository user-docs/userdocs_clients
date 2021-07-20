import { Version } from './version'

export interface Page {
  id: string,
  order: number,
  name: string,
  url: string,
  version: Version
}