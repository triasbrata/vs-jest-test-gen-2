// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { run } from 'jest-test-gen';
import path = require('path');
const extName = 'vs-jest-test-gen-2';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const conf = vscode.workspace.getConfiguration('workspaceValue');
  const suffix = conf.get(`${extName}.suffix-file`, '.spec');
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    `${extName}.generateFile`,
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      if (!vscode.window.activeTextEditor) {
        return;
      }
      const activeDocument = vscode.window.activeTextEditor.document;
      if (activeDocument.uri.scheme !== 'file') {
        return;
      }
      let testFilename = '';
      try {
        testFilename = run({
          _: [activeDocument.fileName],
          fileSuffix: suffix,
        });
      } catch (err: any) {
        console.error(err);
        vscode.window.showErrorMessage(
          'Failed to generate tests :(',
          err.toString()
        );
      }
      if (testFilename.length > 0) {
        const generatedTestFileUri = vscode.Uri.file(testFilename);
        vscode.window.showTextDocument(generatedTestFileUri);
        // Display a message box to the user
        vscode.window.showInformationMessage(
          `Generated ${path.basename(testFilename)}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
