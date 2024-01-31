import { Extends } from "./utils";

Extends(String.prototype, "AddSemicolon", codeBlock =>
    (codeBlock.length === 0 || codeBlock.at(-1) === ';') ?
        codeBlock :
        codeBlock + ";"
);

export class Playground
{
    #code;
    codeBlocks = [];
    output;

    constructor(code)
    {
        this.#code = code;

        this.SplitCode(this.#code);
        this.Render();
    }

    BuildBlocks(codeBlocks, splittedCode) {
        const lastIndex = codeBlocks?.at(-1)?.rowNumber ?? 0;
        let partialBlock = '';
    
        for (let i = lastIndex; i < splittedCode.length; i++) {
            const line = splittedCode[i].trim();
    
            let block = `${partialBlock}${line}`;
    
            try {
                const blocks = codeBlocks
                    .map(x => x.code)
                    .join('');
    
                let lineNumber = i
                while(block.startsWith('.') && lineNumber >= 0) {
                    block = `${splittedCode[--lineNumber].trim()}${block}`
                }
    
                const statement = `${blocks}${block}`
                    .AddSemicolon()
                    //ToDo: temporary removed until understand what is this
                    // .ThrowIfInvalid();
    
                const result = eval(statement);
    
                const codeBlock = {
                    code: block.AddSemicolon(),
                    rowNumber: i + 1,
                    result: result,
                }
    
                return this.AddBlockType(codeBlock)
            } catch (error) {
                partialBlock = block;
            }
        }
    }

    SplitCode(code)
    {
        let codeBlocks = [];
        const splittedCode = code.split('\n');
    
        for(const _ in splittedCode) {
            codeBlocks.push(this.BuildBlocks(codeBlocks, splittedCode))
        }
    
        this.codeBlocks = codeBlocks
            .filter(x => x !== undefined)
            .filter(x => x.code !== '')
            .filter(x => x.type !== 'Comment');
    }

    AddBlockType(block)
    {
        const statementWords = ['const', 'var', 'let', 'function', 'class'];
        const ignoredWords = ['//']
    
        let tempBlock = {...block}
    
        tempBlock = this.AddType(tempBlock, ignoredWords, "Comment")
        tempBlock = this.AddType(tempBlock, statementWords, "Statement")
    
        if (tempBlock.type === undefined) {
            tempBlock = {...tempBlock, type: "Execution"};
        }
    
        return tempBlock;
    }

    AddType(block, words, Type) {
        if (block.type === undefined || block.type === null) {
            for (const word of words) {                
                if (block.code.startsWith(word)) {
                    block = {...block, type: Type};
                    break;
                }
            }
        }
    
        return block;
    }

    Render()
    {
        this.output = this.#code
            .split('\n')
            .map((_, index) => this.codeBlocks.filter(b => b.rowNumber === index + 1)[0]?.result)
            .map((x) => JSON.stringify(x) || '')
            .join('\n');
    }
}
