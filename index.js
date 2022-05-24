const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

$code = $('.code')
$console = $('.console')

$code.addEventListener('keyup', () => {
    RunJS($code.value);
})

function RunJS(code) {
    const codeBlocks = SplitCode(code);
    const consoleOutput = GetConsoleOutput(codeBlocks);
    RenderOutput(code, consoleOutput)
}

function RenderOutput(code, output) {
    $console.value = '';

    code.split('\n').forEach((_, index) => {
        const value = output.filter(x => x.rowNumber === index + 1)[0]?.value || ''

        $console.value += index + ' ';
        $console.value += value;
        $console.value += '\n';
    })
}

function GetConsoleOutput(blocks) {
    let output = [];

    const declarationBlocks = blocks
        .filter(x => x.type === 'Statement')
        .map(x => x.statement)
        .join('');

    blocks
        .filter(x => x.type === 'Execution')
        .forEach(x => {
            output.push({rowNumber: x.rowNumber, value: eval(`${declarationBlocks}${x.statement}`)})
        })
    
    return output;
}

function SplitCode(code) {
    let codeBlocks = []

    for(const _ in code.split('\n')) {
        codeBlocks.push(BuildBlocks(code, codeBlocks))
    }

    codeBlocks = codeBlocks.filter(x => x !== undefined).filter(x => x.statement !== '')

    return codeBlocks.map(x => {return {...x, type: GetBlockType(x)}})
}

function GetBlockType (block) {
    const statementWords = ['const', 'var', 'let', 'function'];

    for (let index = 0; index < statementWords.length; index++) {
        const word = statementWords[index];

        if (block.statement.startsWith(word)) {
            return 'Statement';
        }
    }

    return 'Execution';
}

function BuildBlocks(code, codeBlocks) {
    const lastIndex = codeBlocks?.at(-1)?.rowNumber ?? 0;
    let partialBlock = '';
    
    for (let i = lastIndex; i < code.split('\n').length; i++) {
        const line = code.split('\n')[i];
        const block = `${partialBlock}${line}`;

        try {
            const blocks = codeBlocks.map(x => x.statement).join('');
            const statement = AddSemicolon(`${blocks}${block}`);
            
            eval(statement);

            return {
                statement: AddSemicolon(block),
                rowNumber: i + 1
            }
        } catch (error) {
            partialBlock = block;
        }
    }
}

function AddSemicolon(statement) {
    if (statement.length === 0) {
        return statement;
    }

    if (statement.at(-1) === ';') {
        return statement;
    }

    return `${statement};`;
}
