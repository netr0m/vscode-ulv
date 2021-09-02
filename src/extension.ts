import * as vscode from 'vscode'


export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ulv" is now active!')

  const disposable = vscode.commands.registerCommand('ulv.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from ulv!')
  })

  context.subscriptions.push(disposable)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
