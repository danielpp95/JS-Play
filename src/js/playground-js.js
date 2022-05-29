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

Extends(String.prototype, "ThrowIfInvalid", codeBlock => {
    if(codeBlock.startsWith("for")) {
        const semicolons = codeBlock.split('').filter(x => x === ";");
        if (semicolons.length >= 2) {
            const starIndex = codeBlock.indexOf("(") + 1
            const endIndex = codeBlock.indexOf(")")
            
            const splittedCode = codeBlock
                .slice(starIndex, endIndex)
                .split(';');

            if (
                splittedCode[0].trim() === "" ||
                splittedCode[1].trim() === "" ||
                splittedCode[2].trim() === "" ||
                splittedCode[2].trim().length < 3
            ) {
                throw "INVALID FOR STATEMENT";
            }
        }
    }

    return codeBlock;
});

function BuildBlocks(codeBlocks, splittedCode) {
    const lastIndex = codeBlocks?.at(-1)?.rowNumber ?? 0;
    let partialBlock = '';

    for (let i = lastIndex; i < splittedCode.length; i++) {
        const line = splittedCode[i].trim();

        let block = `${partialBlock}${line}`;

        try {
            const blocks = codeBlocks.map(x => x.code).join('');

            let lineNumber = i
            while(block.startsWith('.') && lineNumber >= 0) {
                block = `${splittedCode[--lineNumber].trim()}${block}`
            }

            const statement = `${blocks}${block}`
                .AddSemicolon()
                .ThrowIfInvalid();

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
        .filter(x => x.code !== '')
        .filter(x => x.type !== 'Comment');
})

function addType(block, words, Type) {
    if (block.type === undefined || block.type === null) {
        for (let index = 0; index < words.length; index++) {
            const word = words[index];
            
            if (block.code.startsWith(word)) {
                block = {...block, type: Type};
                break;
            }
        }
    }
    
    return block;
}

Extends(Array.prototype, "AddBlockType", blocks => {
    const statementWords = ['const', 'var', 'let', 'function', 'class'];
    const ignoredWords = ['//']

    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];

        block = addType(block, ignoredWords, "Comment")
        block = addType(block, statementWords, "Statement")

        if (block.type === undefined) {
            block = {...block, type: "Execution"};
        }

        blocks[i] = block;
    }

    return blocks;
})

Extends(Array.prototype, "FilterInvalidBlocks", blocks => {
    return blocks.filter(x => x.type !== 'Comment')
})

let lastExecution = "";
function RunJS(code) {
    if (code === lastExecution) {
        return;
    }

    const codeBlocks = code
        .SplitCode()
        .AddBlockType()
        .FilterInvalidBlocks();

    const output = codeEditor
        .getValue()
        .split('\n')
        .map((_, index) => codeBlocks.filter(b => b.rowNumber === index + 1)[0]?.result)
        .map((x, index) => JSON.stringify(x) || '')
        .join('\n');

    updateConsoleEditor(output)
    lastExecution = code;
}

RunJS(codeEditor.getValue())

onConsoleEditorKeyUp((e) => {
    RunJS(e.getValue());
})
