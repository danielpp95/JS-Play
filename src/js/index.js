import {
    onCodeEditorKeyUp,
    updateConsoleEditorValue,
} from "./monaco";
import './settings';
import './download';
import { Playground } from './playground';

let lastExecution = "";

function RunJS(code) {
    if (code === lastExecution) {
        return;
    }

    const playground = new Playground(code);

    updateConsoleEditorValue(playground.output);

    lastExecution = code;
}

onCodeEditorKeyUp((e) => {
    RunJS(e.getValue());
})
