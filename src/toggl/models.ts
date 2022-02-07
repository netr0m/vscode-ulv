export type TimeEntry = {
  id?: number
  duration: number
  start: string
  stop?: string
  description?: string
  tags?: string[]
  // eslint-disable-next-line @typescript-eslint/naming-convention
  project_id?: number
  // eslint-disable-next-line @typescript-eslint/naming-convention
  task_id?: number
  // eslint-disable-next-line @typescript-eslint/naming-convention
  workspace_id: number
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_with: string
}

export type UserDetails = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  default_workspace_id: number
}
