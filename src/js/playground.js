import { Extends } from "./utils";

Extends(String.prototype, "AddSemicolon", codeBlock =>
    (codeBlock.length === 0 || codeBlock.at(-1) === ';')
        ? codeBlock
        : codeBlock + ";"
);

class CodeBlock
{
    code;
    output;
    outputIndex;
    type;
    index;

    constructor(code, existingBlocks, index)
    {
        this.code = code;
        this.index = index

        this.Execute(existingBlocks)
        this.AddBlockType();
    }

    Execute(existingBlocks) {
        const splittedCode = this.code.split('\n')
        const lastIndex = existingBlocks?.at(-1)?.outputIndex ?? 0;
        let partialBlock = '';

        for (let i = lastIndex; i < splittedCode.length; i++)
        {
            const line = splittedCode[i].trim();
            
            let block = `${partialBlock}${line}`;
            
            try
            {
                const blocks = existingBlocks
                    .map(x => x.code)
                    .join('');
                
                // let lineNumber = i
                // while(block.startsWith('.') && lineNumber >= 0) {
                //     block = `${splittedCode[--lineNumber].trim()}${block}`
                // }
                
                const statement = `${blocks}${block}`
                .AddSemicolon();
                //ToDo: temporary removed until understand what is this
                // .ThrowIfInvalid();
    
                const result = eval(statement);
                    
                this.code = block.AddSemicolon();
                this.output = result;
                this.outputIndex = i + 1;

                return this
            }
            catch (error)
            {
                partialBlock = block;
            }
        }
    }

    AddBlockType()
    {
        console.log('AddBlockType');
        const statementWords = ['const', 'var', 'let', 'function', 'class'];
        const ignoredWords = ['//'];
        
        this.AddType(ignoredWords, "Comment")
        this.AddType(statementWords, "Statement")
        
        if (this.type === undefined)
        {
            this.type = "Execution";
        }
    }
    
    AddType(words, type)
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

        this.Build();
        this.Render();
    }

    Build()
    {
        let codeBlocks = [];
        const codeLines = this.#code.split('\n');

        for (let index = 0; index < codeLines.length; index++) {
            codeBlocks.push(new CodeBlock(this.#code, codeBlocks, index))
        }
    
        this.#codeBlocks = codeBlocks
            .filter(x => x !== undefined)
            .filter(x => x.code !== '')
            .filter(x => x.type !== 'Comment');
    }

    Render()
    {
        this.output = this.#code
            .split('\n')
            .map((_, index) => this.#codeBlocks.filter(b => b.outputIndex === index + 1)[0]?.output)
            .map((x) => JSON.stringify(x) || '')
            .join('\n');
    }
}
