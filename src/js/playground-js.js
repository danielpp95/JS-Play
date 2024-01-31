import {
    onConsoleEditorKeyUp,
    updateConsoleEditor,
} from "./monaco";

import { Playground } from './playground'

let lastExecution = "";
function RunJS(code) {
    if (code === lastExecution) {
        return;
    }

    const playground = new Playground(code)
    console.log('Playground', playground)

    updateConsoleEditor(playground.output)
    lastExecution = code;
}

onConsoleEditorKeyUp((e) => {
    RunJS(e.getValue());
})
