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

  const phoneme = new Phoneme()

  const input = document.querySelector('#input')
  const output = document.querySelector('#output')

  outputPlaceholder(input, output, phoneme)

  input.addEventListener('input', function() {
    output.textContent = phoneme.convert(this.value)
    outputPlaceholder(input, output, phoneme)
  })
})()
