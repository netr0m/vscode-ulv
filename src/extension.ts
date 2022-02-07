import * as vscode from 'vscode'

import {
  CFG_KEY_API_KEY,
  CMD_UPDATE,
  CMD_OPEN,
  CMD_SET_API_KEY,
  CMD_START,
  CMD_STOP,
  EXTENSION_NAME,
  TOGGL_BASE_URL,
  TOGGL_PATHS,
} from './const'
import Ulv from './Ulv'
import { promptForApiKey } from './utils'

let ulv: Ulv

export function activate(context: vscode.ExtensionContext) {
  const _storeSecretApiKey = (apiKey: string) =>
    context.secrets.store(CFG_KEY_API_KEY, apiKey)

  const _getSecretApiKey = async () => {
    const storedApiKey = await context.secrets.get(CFG_KEY_API_KEY)
    if (!storedApiKey) {
      const suppliedApiKey = await promptForApiKey()
      if (suppliedApiKey) {
        _storeSecretApiKey(suppliedApiKey)
        return suppliedApiKey
      } else {
        const errMsg = 'No Toggl API key was provided.'
        vscode.window.showErrorMessage(`[${EXTENSION_NAME}]: ${errMsg}`)
        throw new Error(errMsg)
      }
    }
    return storedApiKey
  }

  context.globalState?.setKeysForSync([CFG_KEY_API_KEY])

  ulv = new Ulv(_getSecretApiKey)

  console.log(`${EXTENSION_NAME} is now active!`)

  context.subscriptions.push(
    vscode.commands.registerCommand(CMD_START, async () => {
      ulv.start()
    })
  )
  context.subscriptions.push(
    vscode.commands.registerCommand(CMD_STOP, async () => {
      ulv.stop()
    })
  )
  context.subscriptions.push(
    vscode.commands.registerCommand(CMD_UPDATE, async () => {
      ulv.updateStatusBar()
    })
  )
  context.subscriptions.push(
    vscode.commands.registerCommand(CMD_OPEN, () => {
      vscode.commands.executeCommand(
        'vscode.open',
        vscode.Uri.parse(`${TOGGL_BASE_URL}/${TOGGL_PATHS.timer}`)
      )
    })
  )
  context.subscriptions.push(
    vscode.commands.registerCommand(CMD_SET_API_KEY, async () => {
      const apiKey = await promptForApiKey()
      if (apiKey) {
        _storeSecretApiKey(apiKey)
      }
    })
  )

  ulv.updateStatusBar()
  context.subscriptions.push(ulv)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
