import got, { RequestError } from 'got'

import { TimeEntry, UserDetails } from './models'
import { TOGGL_API_BASE_URL, TOGGL_API_BASE_PATH } from '../const'

class TogglAPI {
  client: typeof got

  constructor(apiKey: string) {
    this.client = got.extend({
      prefixUrl: `${TOGGL_API_BASE_URL}/${TOGGL_API_BASE_PATH}`,
      username: apiKey,
      password: 'api_token',
      throwHttpErrors: false,
      retry: {
        limit: 0,
      },
      responseType: 'json',
    })
  }

  async create(timeEntry: TimeEntry) {
    return await this.post<TimeEntry>(
      `workspaces/${timeEntry.workspace_id}/time_entries`,
      timeEntry
    )
  }

  async stop(timeEntry: TimeEntry) {
    return await this.patch<TimeEntry>(
      `workspaces/${timeEntry.workspace_id}/time_entries/${timeEntry.id}/stop`
    )
  }

  async current() {
    return await this.get<TimeEntry>('me/time_entries/current')
  }

  async getUserDetails(): Promise<UserDetails> {
    return await this.get<UserDetails>('me')
  }

  private async get<T>(
    path: string,
    searchParams?: Record<string, string | number | boolean | undefined | null>
  ) {
    return (await this.request(path, { method: 'GET', searchParams })) as T
  }

  private async put<T>(path: string, json: object) {
    return (await this.request(path, { method: 'PUT', json })) as T
  }

  private async post<T>(path: string, json: object) {
    return (await this.request(path, { method: 'POST', json })) as T
  }

  private async patch<T>(path: string, json?: object | undefined) {
    return (await this.request(path, { method: 'PATCH', json })) as T
  }

  private async delete<T>(path: string) {
    return (await this.request(path, { method: 'DELETE' })) as T
  }

  private async request(path: string, options?: object | undefined) {
    try {
      return await this.client(path, options).json()
    } catch (error) {
      const httpErr = error as RequestError
      console.error(
        `An error occurred while interacting with the Toggl API (status=${httpErr.response?.statusCode}): ${httpErr.message}`
      )
      console.debug(httpErr)
    }
  }
}

export default TogglAPI
