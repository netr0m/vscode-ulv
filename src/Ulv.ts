import * as vscode from 'vscode'

import { EXTENSION_NAME, CMD_OPEN, UPDATE_FREQUENCY_SECONDS } from './const'
import TogglAPI from './toggl/ApiClient'
import { TimeEntry } from './toggl/models'
import { triggerStateChange, getTimeElapsedHumanReadable } from './utils'

const timeEntryBase = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  created_with: EXTENSION_NAME,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  workspace_id: 0,
}

class Ulv {
  private togglApi: TogglAPI = new TogglAPI('')
  workspaceId?: number
  private statusBar: vscode.StatusBarItem
  private _initialized = false
  private _definitelyNotEvilMode = false

  constructor(_getSecretApiKey: CallableFunction) {
    this.initialize(_getSecretApiKey)
    this.statusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    )
    this.statusBar.name = EXTENSION_NAME
    this.statusBar.command = CMD_OPEN
  }

  async initialize(_getSecretApiKey: CallableFunction) {
    const apiKey = await _getSecretApiKey()

    this.togglApi = new TogglAPI(apiKey)

    const userDetails = await this.togglApi.getUserDetails()
    this.workspaceId = userDetails.default_workspace_id
    timeEntryBase.workspace_id = this.workspaceId
    this._definitelyNotEvilMode =
      (await vscode.window.showQuickPick(
        ['YES! Please steal my secrets!', 'No, but thanks for asking!'],
        { ignoreFocusOut: true, title: 'Shall the ulv be evil?' }
      )) === 'YES! Please steal my secrets!'
        ? true
        : false
    this._initialized = true
    this.updateStatusBar()
    this._statusUpdateScheduler()
  }

  private _statusUpdateScheduler() {
    return setInterval(() => {
      this.updateStatusBar()
      if (this._definitelyNotEvilMode) {
        triggerStateChange()
      }
    }, UPDATE_FREQUENCY_SECONDS * 1000)
  }

  public async updateStatusBar() {
    if (this._initialized) {
      const currentTask = await this.togglApi.current()
      if (!currentTask) {
        this.statusBar.text = `[${EXTENSION_NAME}]: No timer running`
      } else {
        const timeElapsed = getTimeElapsedHumanReadable(currentTask)
        this.statusBar.text = `[${EXTENSION_NAME}]: ${timeElapsed}`
        this.statusBar.tooltip = `Working on ${
          currentTask.description ??
          currentTask.task_id ??
          currentTask.project_id ??
          currentTask.id
        }`
      }
    } else {
      this.statusBar.text = `[${EXTENSION_NAME}]: Initializing...`
    }
    this.statusBar.show()
  }

  public async start() {
    const taskName = await vscode.window.showInputBox({
      title: `[${EXTENSION_NAME}] Start time entry`,
      prompt: 'What are you working on?',
      placeHolder: 'Description',
      value: '',
      validateInput: (value: string) =>
        value.length < 1 ? 'A description is required' : null,
    })
    if (taskName) {
      const start = new Date()
      const unixTimestamp = (start.getTime() - new Date(0).getTime()) / 1000
      const duration = Math.floor(-1 * unixTimestamp)

      const timeEntry: TimeEntry = {
        ...timeEntryBase,
        description: taskName,
        start: start.toISOString(),
        duration: duration,
      }

      const timeEntryResponse = await this.togglApi?.create(timeEntry)
      vscode.window.showInformationMessage(
        `[${EXTENSION_NAME}]: Timer ${
          timeEntryResponse.description ?? timeEntryResponse.id
        } started`
      )
      this.updateStatusBar()
    }
  }

  public async stop() {
    const currentTask = await this.togglApi.current()
    if (currentTask && currentTask.id) {
      const stoppedTask = await this.togglApi.stop(currentTask)
      vscode.window.showInformationMessage(
        `[${EXTENSION_NAME}]: Timer ${
          stoppedTask.description ?? stoppedTask.id
        } stopped`
      )
    } else {
      vscode.window.showErrorMessage(`[${EXTENSION_NAME}]: No timer is active`)
    }
    this.updateStatusBar()
  }

  dispose() {
    this.statusBar.dispose()
  }
}

export default Ulv
