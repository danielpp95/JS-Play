const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

$code = $('.code')
$console = $('.console')

$code.addEventListener('input', (e) => {
    const stringFullCode = e.target.value
    const splittedCode = splitCode(stringFullCode);
    
    const splittedCodeString = stringFullCode.split('\n');
    const numberOfLines = splittedCodeString.length;

    let output = ''
    for(let i = 0; i < numberOfLines; i++) {
        let result = '';
        const statement = splittedCode.filter(x => x.rowNumber == i + 1)[0]?.statement || ''

        if (statement) {
            const index = splittedCodeString.indexOf(statement)
            const statementsArray = splittedCode.slice(0, index).map(x => x.statement)
            
            let tempCode = `${statementsArray.join(';')};${statement};`
            
            result = isIgnoredOutput(`${statement};`) ? '' : eval(tempCode) || '';
        }

        output += `${result}\n`
    }

    $console.value = output

})

const splitCode = (code) => {
    const statementsList = []
    const codeLines = code.split('\n');

    tempCode = ''
    codeLines.forEach((codeLine, index) => {
        try {
            const statement = `${codeLines.slice(0, index ).join(';')};${codeLine};`;

            eval(statement)

            statementsList.push({statement: `${tempCode}${codeLine}`, rowNumber: index + 1})
            tempCode = ''
        } catch (error) {
            tempCode = `${tempCode}${codeLine}`;
        }
    })

    return statementsList;
}

function isIgnoredOutput (statement) {
    statement = statement.trim();

    if (statement == '') return true

    const reservedWords = ['function', 'const', 'var', '\n', 'let']

    for (let index = 0; index < reservedWords.length; index++) {
        const word = reservedWords[index];
        if (statement.startsWith(word)) return true
    }

    return false;
}