import { Project } from './project'

export interface Page {
  id: string,
  order: number,
  name: string,
  url: string,
  project: Project
}