import { $ } from './utils'
import editorInitialConfig from '../../editor.config.json'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

export const codeEditor = monaco.editor.create($('.code'), {
    ...editorInitialConfig,
})

const consoleEditor = monaco.editor.create($('.console'), {
    ...editorInitialConfig,
    readOnly: true,
})

codeEditor.onDidScrollChange(e => consoleEditor.setScrollTop(e.scrollTop))
codeEditor.onDidChangeCursorPosition(e => consoleEditor.setPosition(e.position))
codeEditor.focus();

consoleEditor.onDidScrollChange(e => codeEditor.setScrollTop(e.scrollTop))
  
export const updateConsoleEditor = value => consoleEditor.getModel().setValue(value)
export const updateConsoleEditorPosition = _ => consoleEditor.setPosition(codeEditor.getPosition());
