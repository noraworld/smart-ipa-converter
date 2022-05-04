class Phoneme {
  constructor(dictionary) {
    this.dictionary = dictionary
    this.symbolsRegExp = new RegExp('[\,\.\!\?\"]', 'g')
  }

  convert(text) {
    text = this.#formatInput(text)

    let sentencePhonemes = ''

    text.trim().split(/\s+/).forEach(word => {
      let wordPhonemes = this.#search(word)

      sentencePhonemes += wordPhonemes
      // if (wordPhonemes.length >= 2) {
      //   sentencePhonemes += wordPhonemes[0]
      // }
      // else {
      //   sentencePhonemes += wordPhonemes[0]
      // }

      // add comma and period
      if (word.search(/[,\.!\?]/g) >= 0) {
        sentencePhonemes += word.match(this.symbolsRegExp).join('')
      }
    })

    sentencePhonemes = sentencePhonemes.replace(/ˈ/g, ' ˈ')

    sentencePhonemes = this.#simplify(sentencePhonemes)
    return sentencePhonemes
  }

  // ’ → '
  // ” → "
  #formatInput(text) {
    const symbols = [
      {
        before: '’',
        after: "'"
      },
      {
        before: '”',
        after: '"'
      }
    ]

    symbols.forEach(symbol => {
      text = text.replace(new RegExp(`${symbol['before']}`, 'g'), symbol['after'])
    })

    return text
  }

  // /ɫ/ → /l/
  // /ɹ/ → /r/
  #simplify(text) {
    const phoneticSymbols = [
      {
        complex: 'ɫ',
        simplified: 'l'
      },
      {
        complex: 'ɹ',
        simplified: 'r'
      }
    ]

    phoneticSymbols.forEach(symbol => {
      text = text.replace(new RegExp(symbol['complex'], 'g'), symbol['simplified'])
    })

    return text
  }

  #search(word) {
    let phonemes = this.dictionary[word.toLowerCase().replace(this.symbolsRegExp, '')]

    if (phonemes) {
      return phonemes.replace(/\//g, '').trim()//.split(/,+/)
    }
    else {
      return ' ??? '
    }
  }
}

export default Phoneme
