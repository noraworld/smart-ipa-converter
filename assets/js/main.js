import Phoneme from './modules/phoneme.js'
import * as Parameter from './modules/parameter.js'
import * as Cookie from './modules/cookie.js'
import * as Utility from './modules/utility.js'

function updateOptionsFromCookie(options) {
  Object.keys(options).forEach(option => {
    let cookie = Cookie.get(option)

    if (cookie) {
      options[option]['value'] = Utility.stringToBoolean(cookie)
    }
  })

  return options
}

function outputPlaceholder(input, output, phoneme) {
  if (!output.textContent) {
    printPhonemes(phoneme.convert(input.placeholder))
    output.style.color = '#cac9c9'
  }
  else {
    output.style.color = '#000000'
  }
}

function createOptionCheckboxes(options, optionsElement) {
  Object.keys(options).forEach(option => {
    optionsElement.insertAdjacentHTML(
      'afterbegin',
      buildOptionCheckboxElements(option, options[option]['descriptionHTML'], options[option]['value'])
    )
  })
}

function buildOptionCheckboxElements(name, desc, checked) {
  return `
    <div>
      <input type="checkbox" name="${name}" id="${name}" ${checked ? 'checked' : ''}>
      <label for="${name}">${desc}</label>
    </div>
  `
}

function printPhonemes(phonemes) {
  document.querySelector('#output').textContent = ''
  document.querySelector('#output').insertAdjacentHTML(
    'afterbegin',
    buildPhonemeElements(phonemes)
  )
}

function buildPhonemeElements(phonemes) {
  let result = ''

  phonemes.forEach(phoneme => {
    phoneme = phoneme.map(value => value.replace(/([\,\.\!\?\"]+$)/g, '$1 '))
    phoneme = phoneme.map(value => value.replace(/([ˈˌ])/g, ' $1'))

    if (phoneme.length >= 2) {
      // console.log("Others: ${phoneme.slice(1).map(value => `"${value}"`).join(' or ')}")
      result += `<span data-sub-phonemes="Others: ${phoneme.slice(1).map(value => `&ldquo;${value}&rdquo;`).join(' or ')}">${phoneme[0]}</span>`
    }
    else {
      result += phoneme[0]
    }
  })

  return result
}

(() => {
  'use strict'

  let options = {
    simplify: {
      description: 'Simplify phonetic alphabets',
      descriptionHTML: 'Simplify phonetic alphabets',
      value: true
    },
    longVowelize: {
      description: 'Append /ː/ symbols',
      descriptionHTML: 'Append <code>/ː/</code> symbols',
      value: true
    },
    ashToBroadA: {
      description: 'Replace /aʊ/ with /æʊ/',
      descriptionHTML: 'Replace <code>/aʊ/</code> with <code>/æʊ/</code>',
      value: true
    },
    schwaToInvertedV: {
      description: 'Replace /ə/ with /ʌ/',
      descriptionHTML: 'Replace <code>/ə/</code> with <code>/ʌ/</code>',
      value: true
    },
    palatalize: {
      description: 'Replace /tr/ & /dr/ with /tʃr/ & /dʒr/',
      descriptionHTML: 'Replace <code>/tr/</code> & <code>/dr/</code> with <code>/tʃr/</code> & <code>/dʒr/</code>',
      value: true
    }
  }
  options = updateOptionsFromCookie(options)

  const phoneme = new Phoneme(options)
  const input = document.querySelector('#input')
  const output = document.querySelector('#output')
  const optionsElement = document.querySelector('#options')

  createOptionCheckboxes(options, optionsElement)

  if (Parameter.get('text')) {
    input.value = Parameter.get('text')
    printPhonemes(phoneme.convert(Parameter.get('text')))
  }

  outputPlaceholder(input, output, phoneme)

  input.addEventListener('input', function() {
    printPhonemes(phoneme.convert(this.value))
    outputPlaceholder(input, output, phoneme)
    Parameter.set(`?text=${this.value}`)
  })

  // option checkbox event handler
  document.querySelectorAll('#options div input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      options[this.id]['value'] = this.checked
      printPhonemes(phoneme.convert(input.value))
      outputPlaceholder(input, output, phoneme)
      document.cookie = `${this.id}=${this.checked}`
    })
  })
})()
