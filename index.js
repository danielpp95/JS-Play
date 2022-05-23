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
        const statement = splittedCode.filter(x => x.rowNumber == i + 1)[0].statement || ''

        if (statement) {
            let tempCode = splittedCode.filter(x => x.rowNumber < i + 2).map(x => x.statement).join('\n')
            console.log(tempCode)
            result = eval(tempCode) || ''
        }

        output += `${result}\n`
    }

    $console.value = output

})

const splitCode = (code) => {
    const tempCodeList = []

    code.split('\n').forEach((statement, index) => {
        tempCodeList.push({statement, rowNumber: index + 1})
    })

    return tempCodeList;
}