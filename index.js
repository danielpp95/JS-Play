const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

$code = $('.code')
$console = $('.console')

$code.addEventListener('input', (e) => {
    const stringFullCode = e.target.value
    const splittedCode = splitCode(stringFullCode);
    
    const numberOfLines = stringFullCode.split('\n').length;

    let output = ''
    for(let i = 0; i < numberOfLines; i++) {
        let result = '';
        const statement = splittedCode.filter(x => x.rowNumber == i + 1)[0]?.statement || ''

        if (statement) {
            const statementsArray = splittedCode.slice(0, i + 1).map(x => x.statement)
            // console.log(statementsArray, i)
            let tempCode = statementsArray.join(';')
            // console.log(tempCode, i)
            result = isIgnoredOutput(statement) ? '' : eval(tempCode) || ''
        }

        output += `${result}\n`
    }

    $console.value = output

})

const splitCode = (code) => {
    const statementsList = []
    const codeLines = code.split('\n');

    // let statementList = ['']

    tempCode = ''
    codeLines.forEach((codeLine, index) => {
        try {
            const statement = `${codeLines.slice(0, index).join('')}${codeLine};`;
            // console.log(statement)
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

    const reservedWords = ['function', 'const', 'var', '\n']

    for (let index = 0; index < reservedWords.length; index++) {
        const word = reservedWords[index];
        if (statement.startsWith(word)) {
            return true
        }
        
    }

    return false;
}