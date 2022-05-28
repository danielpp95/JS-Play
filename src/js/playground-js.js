import {
    codeEditor,
    updateConsoleEditor,
    onConsoleEditorKeyUp,
} from "./monaco";

import { Extends } from "./utils";

Extends(String.prototype, "AddSemicolon", codeBlock => 
    (codeBlock.length === 0 || codeBlock.at(-1) === ';') ?
        codeBlock :
        codeBlock + ";"
);

function BuildBlocks(codeBlocks, splittedCode) {
    const lastIndex = codeBlocks?.at(-1)?.rowNumber ?? 0;
    let partialBlock = '';
    
    for (let i = lastIndex; i < splittedCode.length; i++) {
        const line = splittedCode[i].trim();

        const block = `${partialBlock}${line}`;

        try {
            const blocks = codeBlocks.map(x => x.code).join('');
            const statement = `${blocks}${block}`.AddSemicolon();

            const result = eval(statement);

            return {
                code: block.AddSemicolon(),
                rowNumber: i + 1,
                result: result,
            }
        } catch (error) {
            partialBlock = block;
        }
    }
}

Extends(String.prototype, "SplitCode", (code) => {
    let codeBlocks = [];
    const splittedCode = code.split('\n');

    for(const _ in splittedCode) {
        codeBlocks.push(BuildBlocks(codeBlocks, splittedCode))
    }

    return codeBlocks
        .filter(x => x !== undefined)
        .filter(x => x.code !== '');
})

Extends(Array.prototype, "AddBlockType", blocks => {
    const statementWords = ['const', 'var', 'let', 'function', 'class'];
    
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        for (let index = 0; index < statementWords.length; index++) {
            const word = statementWords[index];
            
            if (block.code.startsWith(word)) {
                blocks[i] = {...block, type: "Statement"};
                break;
            }

            blocks[i] = {...block, type: "Execution"};
        }
    }

    return blocks;
})

let lastExecution = "";
function RunJS(code) {
    if (code === lastExecution) {
        return;
    }

    const codeBlocks = code
        .SplitCode()
        .AddBlockType();
    
    const output = codeEditor
        .getValue()
        .split('\n')
        .map((_, index) => codeBlocks.filter(b => b.rowNumber === index + 1)[0]?.result || '')
        .join('\n');

    updateConsoleEditor(output)
}

RunJS(codeEditor.getValue())

onConsoleEditorKeyUp((e) => {
    RunJS(e.getValue());
})