const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

$code = $('.code')
$console = $('.console')

$code.addEventListener('input', (e) => {
    const stringFullCode = e.target.value
    const splittedCode = splitCode(stringFullCode);
    
    const numberOfLines = stringFullCode.split('\n').length;
// console.log(numberOfLines)
    output = ''
    for(let i = 0; i < numberOfLines; i++) {
        const code = eval(splittedCode.filter(x => x.rowNumber == i + 1)[0]?.statement) || '';
        output = `${output}${code}\n`
    }
// console.log(output)
    // $console.value = splittedCode.map(x => `${x.rowNumber} ${eval(x.statement)}\n`)
    $console.value = output

})

const splitCode = (code) => {
    const tempCodeList = []

    tempCode = ''
    code.split('\n').forEach((statement, index) => {
        try {
            const s = `${tempCode}${statement}`;
            eval(s)
            tempCodeList.push({statement: s, rowNumber: index + 1})
            tempCode = ''
        } catch (error) {
            tempCode = 
`${tempCode}
${statement}`;
        }
    })
    tempCodeList.push(tempCode)

    tempCodeList.forEach(x => console.log(x))

    return tempCodeList;
}