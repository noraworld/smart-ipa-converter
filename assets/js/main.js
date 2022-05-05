import Dictionary from './modules/dictionary.js'
import Phoneme from './modules/phoneme.js'

function outputPlaceholder(input, output, phoneme) {
  if (!output.textContent) {
    output.textContent = phoneme.convert(input.placeholder)
    output.style.color = '#cac9c9'
  }
  else {
    output.style.color = '#000000'
  }
}

(() => {
  'use strict'

  const dictionary = new Dictionary('assets/dictionary/en_US.json')
  const phoneme = new Phoneme(dictionary.load())

  const input = document.querySelector('#input')
  const output = document.querySelector('#output')

  outputPlaceholder(input, output, phoneme)

  input.addEventListener('input', function() {
    output.textContent = phoneme.convert(this.value)
    outputPlaceholder(input, output, phoneme)
  })
})()
