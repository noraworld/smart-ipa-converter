import Dictionary from './modules/dictionary.js'
import Phoneme from './modules/phoneme.js'

(() => {
  'use strict'

  const dictionary = new Dictionary('assets/dictionary/en_US.json')
  const phoneme = new Phoneme(dictionary.load())

  document.querySelector('#input').addEventListener('input', function() {
    document.querySelector('#output').textContent = phoneme.convert(this.value)
  })
})()
