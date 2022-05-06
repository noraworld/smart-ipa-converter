import Dictionary from './dictionary.js'
import Reduction from './reduction.js'

class Phoneme {
  constructor(options = {}) {
    this.options = options

    const dictionary = new Dictionary()

    this.dictionary = dictionary.load('assets/resources/en_US.json')['en_US'][0]
    this.phonemes = dictionary.load('assets/resources/phoneme.json')
    this.reduction = new Reduction()

    this.delimiterSymbolRegExp = new RegExp('[\,\.\!\?\"]', 'g')
  }

  convert(text) {
    if (!text) return ''

    text = this.#formatInput(text)

    let sentencePhonemes = ''
    let prevWord = null
    let prevWordWithoutDelimiter = null
    let prevWordPhonemes = null
    let nextWord = null
    let nextWordPhonemes = null
    let words = text.trim().split(/\s+/)

    words.forEach((word, index) => {
      let wordPhonemes = this.#search(word)

      if (words[index + 1]) {
        nextWord = words[index + 1]
        nextWordPhonemes = this.#search(nextWord)
      }
      else {
        nextWord = null
        nextWordPhonemes = null
      }

      if (prevWord) {
        prevWordWithoutDelimiter = prevWord.replace(this.delimiterSymbolRegExp, '')
      }
      else {
        prevWordWithoutDelimiter = null
      }

      if (this.options['longVowelize']['value']) wordPhonemes = this.#longVowelize(wordPhonemes)
      if (this.options['ashToBroadA']['value']) wordPhonemes = this.#ashToBroadA(wordPhonemes)
      if (this.options['palatalize']['value']) wordPhonemes = this.#palatalize(wordPhonemes)
      if (this.options['schwaToInvertedV']['value']) wordPhonemes = this.#schwaToInvertedV(wordPhonemes)

      this.reduction.prevWord = prevWord
      this.reduction.prevWordWithoutDelimiter = prevWordWithoutDelimiter
      this.reduction.prevWordPhonemes = prevWordPhonemes
      this.reduction.word = word
      this.reduction.wordWithoutDelimiter = word.replace(this.delimiterSymbolRegExp, '')
      this.reduction.wordPhonemes = wordPhonemes
      this.reduction.nextWord = nextWord
      this.reduction.nextWordPhonemes = nextWordPhonemes
      this.reduction.text = text
      wordPhonemes = this.reduction.convert()

      sentencePhonemes += wordPhonemes
      // if (wordPhonemes.length >= 2) {
      //   sentencePhonemes += wordPhonemes[0]
      // }
      // else {
      //   sentencePhonemes += wordPhonemes[0]
      // }

      sentencePhonemes += this.#restoreSymbol(word)

      prevWord = word
      prevWordPhonemes = wordPhonemes
    })

    sentencePhonemes = sentencePhonemes.replace(/ˈ/g, ' ˈ').trim()

    if (this.options['simplify']['value']) sentencePhonemes = this.#simplify(sentencePhonemes)
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
    this.phonemes['complex_and_simplified_with_long_vowels'].forEach(symbol => {
      text = text.replace(new RegExp(symbol['complex'], 'g'), symbol['simplified'])
    })

    this.phonemes['complex_and_simplified'].forEach(symbol => {
      text = text.replace(new RegExp(symbol['complex'], 'g'), symbol['simplified'])
    })

    return text
  }

  // /fli/ → /fliː/
  #longVowelize(wordPhonemes) {
    this.phonemes['long_vowels'].forEach(phoneme => {
      wordPhonemes = wordPhonemes.replace(
        new RegExp(`(${this.phonemes['stresses']}[${this.phonemes['consonants'].join('')}]*${phoneme})`, 'g'),
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

  #schwaToInvertedV(wordPhonemes) {
    return wordPhonemes.replace(
      new RegExp(`(${this.phonemes['stresses']}[${this.phonemes['consonants'].join('')}]*)ə`, 'g'),
      '$1ʌ'
    )
  }

  // function name from: https://www.reddit.com/r/linguistics/comments/1vgtwg/tr_vs_t%CA%83r/
  #palatalize(wordPhonemes) {
    wordPhonemes = wordPhonemes.replace(/tr/g, 'tʃr')
    wordPhonemes = wordPhonemes.replace(/tɹ/g, 'tʃɹ')
    wordPhonemes = wordPhonemes.replace(/dr/g, 'dʒr') // TODO: which one should I choose: dʒ, ʤ
    wordPhonemes = wordPhonemes.replace(/dɹ/g, 'dʒɹ') // TODO: which one should I choose: dʒ, ʤ

    return wordPhonemes
  }

  #restoreSymbol(word) {
    if (word.search(this.delimiterSymbolRegExp) >= 0) {
      return word.match(this.delimiterSymbolRegExp).join('')
    }
    else {
      return ''
    }
  }

  #search(word) {
    let phonemes = this.dictionary[word.toLowerCase().replace(this.delimiterSymbolRegExp, '')]

    if (phonemes) {
      return phonemes.replace(/\//g, '').trim()//.split(/,+/)
    }
    else {
      return ' ??? '
    }
  }
}

export default Phoneme
