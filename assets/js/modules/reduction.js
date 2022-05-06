import Dictionary from './dictionary.js'

class Reduction {
  constructor(prevWord, prevWordWithoutDelimiter, prevWordPhonemes, word, wordWithoutDelimiter, wordPhonemes, nextWord, nextWordPhonemes, text) {
    const dictionary = new Dictionary()
    this.reductions = dictionary.load('assets/resources/reduction.json')
    this.phonemes = dictionary.load('assets/resources/phoneme.json')
    this.delimiterSymbolRegExp = new RegExp('[\,\.\!\?\"]', 'g')

    this.prevWord = prevWord
    this.prevWordWithoutDelimiter = prevWordWithoutDelimiter
    this.prevWordPhonemes = prevWordPhonemes
    this.word = word
    this.wordWithoutDelimiter = wordWithoutDelimiter
    this.wordPhonemes = wordPhonemes
    this.nextWord = nextWord
    this.nextWordPhonemes = nextWordPhonemes
    this.text = text
  }

  convert() {
    // no reduction
    if (this.#isSingle()) {
      return this.reductions['all'][this.wordWithoutDelimiter][0]
    }
    // standard reduction (no special rules)
    else if (Object.keys(this.reductions['standard']).includes(this.wordWithoutDelimiter)) {
      return this.reductions['standard'][this.wordWithoutDelimiter][1]
    }
    // anomaly reduction (special rules)
    else if (this.#isAnomaly()) {
      return this.reductions['anomaly'][this.wordWithoutDelimiter][1]
    }
    // no reduction but don't load from dictionary
    else if (Object.keys(this.reductions['all']).includes(this.wordWithoutDelimiter)) {
      return this.reductions['all'][this.wordWithoutDelimiter][0]
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

    // "the"
    //
    // reduction if:
    //   the first phoneme of a next word is a consonant
    // no reduction if:
    //   the first phoneme of a next word is a vowel
    //
    if (this.wordWithoutDelimiter === 'the') {
      if (!this.nextWord) return false
      if (this.word !== this.wordWithoutDelimiter) return false
      if (this.nextWordPhonemes.search(
        new RegExp(`^${this.phonemes['stresses']}?[${this.phonemes['vowels'].join('')}]`,
        'g')
      ) >= 0) {
        return false
      }

      return true
    }

    // "for"
    //
    // reduction if:
    //   it is not the end of the sentence
    // no reduction if:
    //   if is the end of the sentence
    //
    if (this.wordWithoutDelimiter === 'for') {
      if (!this.nextWord) return false
      if (this.word !== this.wordWithoutDelimiter) return false

      return true
    }

    // "he", "his", "him", "her"
    //
    // reduction if:
    //   the end phoneme of a prev word is a consonant
    // no reduction if:
    //   a prev word does not exist
    //   the end phoneme of a prev word is a vowel
    //
    if (['he', 'his', 'him', 'her'].includes(this.wordWithoutDelimiter)) {
      if (!this.prevWord) return false
      if (this.prevWord !== this.prevWordWithoutDelimiter) return false
      if (this.prevWordPhonemes.search(new RegExp(`[${this.phonemes['vowels'].join('')}]$`, 'g')) >= 0) return false

      return true
    }

    return false
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
      Object.keys(this.reductions['all']).includes(this.wordWithoutDelimiter)
    ) {
      return true
    }

    // return non-reduction phonemes if a sentence has only a single reduction word
    if (
      this.prevWord &&
      this.prevWord.search(this.delimiterSymbolRegExp) >= 0 &&
      this.word.search(this.delimiterSymbolRegExp) >= 0 &&
      Object.keys(this.reductions['all']).includes(this.wordWithoutDelimiter)
    ) {
      return true
    }

    return false
  }
}

export default Reduction
