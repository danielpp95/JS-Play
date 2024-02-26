import { $ } from './utils/dom'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { getState, subscribe } from './state'

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

const editorState = getState();

export const codeEditor = monaco.editor.create($('.code'), {
    ...editorState,
});

const consoleEditor = monaco.editor.create($('.console'), {
    ...editorState,
    readOnly: true,
});

const EDITORS = [codeEditor, consoleEditor];

subscribe(state => {
    const newOptions = {...state, minimap: { enabled: state.minimap }};

    Object.values(EDITORS).forEach(editor => {
        editor.updateOptions({
            ...editor.getRawOptions(),
            ...newOptions,
        });
    });
});

// Sync editors scroll
codeEditor.onDidScrollChange(e => consoleEditor.setScrollTop(e.scrollTop));
consoleEditor.onDidScrollChange(e => codeEditor.setScrollTop(e.scrollTop));

// Sync editors cursor
codeEditor.onDidChangeCursorPosition(e => consoleEditor.setPosition(e.position));

codeEditor.focus();

export const updateConsoleEditorValue = value => consoleEditor.getModel().setValue(value);
export const onCodeEditorKeyUp = callback => codeEditor.getModel().onDidChangeContent(_ => callback(codeEditor));
export const updateCodeEditorValue = value => codeEditor.getModel().setValue(value);
