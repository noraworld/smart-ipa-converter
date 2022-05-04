class Phoneme {
  constructor(dictionary) {
    this.dictionary = dictionary
    this.symbolsRegExp = new RegExp('[\,\.\!\?\"]', 'g')
    this.vowels = ['ɑ', 'æ', 'ɔ', 'ə', 'ʌ', 'ɛ', 'e', 'ɪ', 'i', 'ʊ', 'u', 'ɜ']
    this.diphthongs = ['aɪ', 'aʊ', 'æʊ', 'oʊ', 'ɔɪ', 'eɪ']
    this.consonants = [
      'p',
      'b',
      't',
      'd',
      'k',
      'ɡ',
      'g', // same as 'ɡ'
      'f',
      'v',
      'θ',
      'ð',
      's',
      'z',
      'ʃ',
      'ʒ',
      'h',
      'tʃ',
      'ʤ',
      'dʒ', // same as 'ʤ'
      'm',
      'n',
      'ŋ',
      'w',
      'ɹ',
      'r', // same as 'ɹ'
      'j',
      'ɫ',
      'l', // same as 'ɫ'
    ]
    this.stressSymbol = ['ˈ']
  }

  convert(text) {
    text = this.#formatInput(text)

    let sentencePhonemes = ''

    text.trim().split(/\s+/).forEach(word => {
      let wordPhonemes = this.#search(word)
      wordPhonemes = this.#longVowelize(wordPhonemes)
      wordPhonemes = this.#ashToBroadA(wordPhonemes)

      sentencePhonemes += wordPhonemes
      // if (wordPhonemes.length >= 2) {
      //   sentencePhonemes += wordPhonemes[0]
      // }
      // else {
      //   sentencePhonemes += wordPhonemes[0]
      // }

      sentencePhonemes += this.#restoreSymbol(word)
    })

    sentencePhonemes = sentencePhonemes.replace(/ˈ/g, ' ˈ').trim()

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
    const phoneticSymbolsWithLongVowelSymbol = [
      {
        complex: 'ɝː',
        simplified: 'ɜːr'
      },
      {
        complex: 'ɚː',
        simplified: 'əːr'
      }
    ]

    const phoneticSymbols = [
      {
        complex: 'ɫ',
        simplified: 'l'
      },
      {
        complex: 'ɹ',
        simplified: 'r'
      },
      {
        complex: 'ɝ',
        simplified: 'ɜr'
      },
      {
        complex: 'ɚ',
        simplified: 'ər'
      },
      {
        complex: 'ɛ',
        simplified: 'e'
      },
      {
        complex: 'ʤ',
        simplified: 'dʒ'
      }
    ]

    phoneticSymbolsWithLongVowelSymbol.forEach(symbol => {
      text = text.replace(new RegExp(symbol['complex'], 'g'), symbol['simplified'])
    })

    phoneticSymbols.forEach(symbol => {
      text = text.replace(new RegExp(symbol['complex'], 'g'), symbol['simplified'])
    })

    return text
  }

  // /fli/ → /fliː/
  #longVowelize(wordPhonemes) {
    const longPattern = ['ɑ', 'ɔ', 'i', 'u', 'ɜ', 'ɝ', 'ɚ']

    longPattern.forEach(phoneme => {
      wordPhonemes = wordPhonemes.replace(
        new RegExp(`(${this.stressSymbol}[${this.consonants.join('')}]*${phoneme})`, 'g'),
        '$1ː'
      )
    })

    return wordPhonemes
  }

  // /aʊ/ → /æʊ/
  // https://www.kenkyusha.co.jp/purec/images/mihon%20hoka/327-76490-hatsuonkigo-namae.pdf
  #ashToBroadA(wordPhonemes) {
    return wordPhonemes.replace(/aʊ/g, 'æʊ')
  }

  #restoreSymbol(word) {
    if (word.search(this.symbolsRegExp) >= 0) {
      return word.match(this.symbolsRegExp).join('')
    }
    else {
      return ''
    }
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
