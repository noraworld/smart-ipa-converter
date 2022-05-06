import Dictionary from './dictionary.js'

class Reduction {
  constructor() {
    const dictionary = new Dictionary()
    this.reductions = dictionary.load('assets/resources/reduction.json')

    this.delimiterSymbolRegExp = new RegExp('[\,\.\!\?\"]', 'g')
  }

  convert(beforeWord, word, wordPhonemes, text) {
    // no reduction
    if (this.#isSingle(beforeWord, word, text)) {
      return this.reductions['all'][word.replace(this.delimiterSymbolRegExp, '')][0]
    }
    // standard reduction (no special rules)
    else if (Object.keys(this.reductions['standard']).includes(word.replace(this.delimiterSymbolRegExp, ''))) {
      return this.reductions['standard'][word.replace(this.delimiterSymbolRegExp, '')][1]
    }
    // anomaly reduction (special rules)
    else if (this.#isAnomaly(beforeWord, word, text)) {
      return this.reductions['anomaly'][word.replace(this.delimiterSymbolRegExp, '')][1]
    }
    // no reduction
    else {
      return wordPhonemes
    }
  }

  #isAnomaly(beforeWord, word, text) {
    return false // TODO
  }

  // return true if:
  //   a whole text has only a single reduction word
  //   a sentence has only a single reduction word
  // otherwise return false
  #isSingle(beforeWord, word, text) {
    text = text.toLowerCase().trim().replace(this.delimiterSymbolRegExp, '')
    if (beforeWord !== null) beforeWord = beforeWord.toLowerCase().trim()
    word = word.toLowerCase().trim()

    // return non-reduction phonemes if a whole text has only a single reduction word
    if (Object.keys(this.reductions['all']).includes(text)) {
      return true
    }

    if (
      beforeWord === null &&
      word.search(this.delimiterSymbolRegExp) >= 0 &&
      Object.keys(this.reductions['all']).includes(word.replace(this.delimiterSymbolRegExp, ''))
    ) {
      return true
    }

    // return non-reduction phonemes if a sentence has only a single reduction word
    if (
      beforeWord !== null &&
      beforeWord.search(this.delimiterSymbolRegExp) >= 0 &&
      word.search(this.delimiterSymbolRegExp) >= 0 &&
      Object.keys(this.reductions['all']).includes(word.replace(this.delimiterSymbolRegExp, ''))
    ) {
      return true
    }

    return false
  }
}

export default Reduction
