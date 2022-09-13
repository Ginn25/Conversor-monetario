const currencyAccepted = {
    'Real brasileiro': 'BRL',
    'Dólar americano': 'USD',
    'Iene japonês': 'JPY',
    'Libra esterlina': 'GBP'
}

listCurrency()

function listCurrency(){
    for(let currency in currencyAccepted){
        let accepted = `<option>${currency}</option>`

        document.querySelector('#entry_select').innerHTML += accepted
        document.querySelector('#out_select').innerHTML += accepted
    }
}

let selects = document.querySelectorAll('select')
selects.forEach(element => element.addEventListener('change',handleSelect)) 

function handleSelect({ target }){
    if(target.id == '#entry_select'){
        handleInformation(document.querySelector('#out_input'))
    }else{
        handleInformation(document.querySelector('#entry_input'))
    }
}

let inputs = document.querySelectorAll('input')

inputs.forEach(element => {
    element.addEventListener('focusout', handleInformation)
    element.addEventListener('keydown', handleKeydown)
})

function handleKeydown(event){ if(event.key == 'Enter') handleInformation(event) }

function handleInformation(event){
    let target = event.target || event
    let entrySelect = document.querySelector('#entry_select').value
    let outSelect = document.querySelector('#out_select').value
    let currencyEntry = currencyType(entrySelect)
    let currencyOut = currencyType(outSelect)
    let url = 'https://economia.awesomeapi.com.br/last/'
    let currencyName = ''
    let inputId = 'out_input'

    target.value = parseFloat(target.value).toFixed(2)

    if(currencyEntry === currencyOut){
        document.querySelector('#out_input').value = target.value
        return
    }

    if(target.id == inputId){
        inputId = 'entry_input'
        url += `${currencyOut}-${currencyEntry}`
        currencyName = currencyOut + currencyEntry
    }else{
        url += `${currencyEntry}-${currencyOut}`
        currencyName = currencyEntry + currencyOut
    }

    getResults({
        target,
        url,
        currencyName,
        inputId
    })
}

function converter(params){
    let currencyName = params.currencyName
    let target = params.target
    let targetValue = target.value
    let currencyValue = params.result[currencyName].ask
    let inputId = params.inputId

    document.getElementById(inputId).value = (targetValue * currencyValue).toFixed(2)
}
    
function currencyType(currency){
    return currencyAccepted[currency]
}

function getResults(params) {
    fetch(`${params.url}`)
    .then(currency => {
        return currency.json();
    }).then((result)=>{
        params.result = result
        converter(params)
    });
}
