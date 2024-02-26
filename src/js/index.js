import {
    onCodeEditorKeyUp,
    updateConsoleEditorValue,
    updateCodeEditorValue,
} from "./monaco";
import './settings';
import './download';
import { Playground } from './playground';
import { getState, subscribe } from './state';

const {
    updateSettings,
    ...settings
} = getState()

let lastExecution = "";
let autoSave = settings.autoSave;

function RunJS(code) {
    if (code === lastExecution) {
        return;
    }

    const playground = new Playground(code);

    updateConsoleEditorValue(playground.output);

    lastExecution = code;
}

subscribe(state => autoSave = state.autoSave)

onCodeEditorKeyUp((e) => {
    const value = e.getValue();

    RunJS(value);

    if(autoSave){
        updateSettings({ key: "text", value: value });
    }
})

if (settings.autoSave) {
    updateCodeEditorValue(settings.text);
    RunJS(settings.text);
}