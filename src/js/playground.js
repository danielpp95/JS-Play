import { Extends } from "./utils";

Extends(String.prototype, "AddEndingSemicolon", codeBlock =>
    (codeBlock.length === 0 || codeBlock.at(-1) === ';')
        ? codeBlock
        : codeBlock + ";"
);

const STATEMENT = "Statement";
const COMMENT = "Comment";
const EXECUTION = "Execution";

class CodeBlock
{
    code;
    output;
    outputIndex;
    type;
    index;
    codeLines;

    constructor(code, existingBlocks, index, codeLines)
    {
        this.code = code;
        this.index = index;
        this.codeLines = codeLines;

        this.#Build(existingBlocks)
        this.#AddBlockType();
    }

    #Build(existingBlocks) {
        const previousLineIndex = existingBlocks?.at(-1)?.outputIndex ?? 0;
        let partialBlock = '';

        
        for (let i = previousLineIndex; i < this.codeLines.length; i++)
        {
            const codeLine = this.codeLines[i].trim();
            let blockTemp = `${partialBlock}${codeLine}`;
            let statement;
            try
            {
                const previousBlocksCode = this.code
                    .split('\n')
                    .slice(0, previousLineIndex)
                    .map(x => `${x}\n`)
                    .join('\n');

                statement = `${previousBlocksCode} ${blockTemp}`;
                const result = eval(statement);

                this.code = blockTemp.AddEndingSemicolon();
                this.output = result;
                this.outputIndex = i + 1;

                return this
            }
            catch (error)
            {
                partialBlock = blockTemp;
                // console.log(this.index, statement)
            }
        }
    }

    #AddBlockType()
    {
        const statementWords = ['const', 'var', 'let', 'function', 'class'];
        const ignoredWords = ['//'];
        
        this.#AddType(ignoredWords, COMMENT)
        this.#AddType(statementWords, STATEMENT)
        
        if (this.type === undefined)
        {
            this.type = EXECUTION;
        }
    }
    
    #AddType(words, type)
    {
        if ((this.type === undefined || this.type === null) &&
            words.some(x => this.code.startsWith(x)))
        {
            this.type = type;
        }
    }
}

export class Playground
{
    #code;
    #codeBlocks = [];
    output;

    constructor(code)
    {
        this.#code = code;

        this.#Build();
        this.#Render();
    }

    #Build()
    {
        let codeBlocks = [];
        const codeLines = this.#code.split('\n');

        for (let index = 0; index < codeLines.length; index++) {
            codeBlocks.push(new CodeBlock(this.#code, codeBlocks, index, codeLines))
        }
    
        this.#codeBlocks = codeBlocks
            .filter(x => x !== undefined)
            .filter(x => x.code !== '')
            .filter(x => x.type !== COMMENT);
    }

    #Render()
    {
        this.output = this.#code
            .split('\n')
            .map((_, index) => this.#codeBlocks.filter(b => b.outputIndex === index + 1 && b.type === EXECUTION)[0]?.output)
            .map((x) => JSON.stringify(x) || '')
            .join('\n');
    }
}
