import Dictionary from './dictionary.js'

class Reduction {
  constructor(prevWord, prevWordPhonemes, word, wordPhonemes, nextWord, nextWordPhonemes, text) {
    const dictionary = new Dictionary()
    this.reductions = dictionary.load('assets/resources/reduction.json')
    this.delimiterSymbolRegExp = new RegExp('[\,\.\!\?\"]', 'g')

    this.prevWord = prevWord
    this.prevWordPhonemes = prevWordPhonemes
    this.word = word
    this.wordPhonemes = wordPhonemes
    this.nextWord = nextWord
    this.nextWordPhonemes = nextWordPhonemes
    this.text = text
  }

  convert() {
    // no reduction
    if (this.#isSingle()) {
      return this.reductions['all'][this.word.replace(this.delimiterSymbolRegExp, '')][0]
    }
    // standard reduction (no special rules)
    else if (Object.keys(this.reductions['standard']).includes(this.word.replace(this.delimiterSymbolRegExp, ''))) {
      return this.reductions['standard'][this.word.replace(this.delimiterSymbolRegExp, '')][1]
    }
    // anomaly reduction (special rules)
    else if (this.#isAnomaly()) {
      return this.reductions['anomaly'][this.word.replace(this.delimiterSymbolRegExp, '')][1]
    }
    // no reduction
    else {
      return this.wordPhonemes
    }
  }

  #isAnomaly() {
    // console.log(`prevWord: ${this.prevWord}`)
    // console.log(`prevWordPhonemes: ${this.prevWordPhonemes}`)
    // console.log(`word: ${this.word}`)
    // console.log(`wordPhonemes: ${this.wordPhonemes}`)
    // console.log(`nextWord: ${this.nextWord}`)
    // console.log(`nextWordPhonemes: ${this.nextWordPhonemes}`)
    // console.log('')

    return false // TODO
  }

  // return true if:
  //   a whole text has only a single reduction word
  //   a sentence has only a single reduction word
  // otherwise return false
  #isSingle() {
    this.text = this.text.toLowerCase().trim().replace(this.delimiterSymbolRegExp, '')
    if (this.prevWord) this.prevWord = this.prevWord.toLowerCase().trim()
    this.word = this.word.toLowerCase().trim()

    // return non-reduction phonemes if a whole text has only a single reduction word
    if (Object.keys(this.reductions['all']).includes(this.text)) {
      return true
    }

    if (
      this.prevWord &&
      this.word.search(this.delimiterSymbolRegExp) >= 0 &&
      Object.keys(this.reductions['all']).includes(this.word.replace(this.delimiterSymbolRegExp, ''))
    ) {
      return true
    }

    // return non-reduction phonemes if a sentence has only a single reduction word
    if (
      this.prevWord &&
      this.prevWord.search(this.delimiterSymbolRegExp) >= 0 &&
      this.word.search(this.delimiterSymbolRegExp) >= 0 &&
      Object.keys(this.reductions['all']).includes(this.word.replace(this.delimiterSymbolRegExp, ''))
    ) {
      return true
    }

    return false
  }
}

export default Reduction
