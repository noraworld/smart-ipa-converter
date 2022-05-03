class Phoneme {
  constructor(dictionary) {
    this.dictionary = dictionary;
  }

  convert(text) {
    const symbols = '[,\.!\?]';

    let sentencePhonemes = '';

    text.trim().split(/\s+/).forEach(word => {
      let wordPhonemes = this.dictionary[word.toLowerCase().replace(new RegExp(symbols, 'g'), '')].replace(/\//g, '').trim()//.split(/,+/);

      sentencePhonemes += wordPhonemes;
      // if (wordPhonemes.length >= 2) {
      //   sentencePhonemes += wordPhonemes[0];
      // }
      // else {
      //   sentencePhonemes += wordPhonemes[0];
      // }

      // add comma and period
      if (word.search(/[,\.!\?]/g) >= 0) {
        sentencePhonemes += word.match(new RegExp(symbols, 'g')).join('');
      }
    });

    sentencePhonemes = sentencePhonemes.replace(/ˈ/g, ' ˈ');

    return sentencePhonemes;
  }
}

export default Phoneme;
