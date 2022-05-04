import Dictionary from './dictionary.js'
import Phoneme from './phoneme.js'

const dictionary = new Dictionary('assets/dictionary/en_US.json')
const phoneme = new Phoneme(dictionary.load())

xdescribe('formatInput', () => {
  test('UTF-8 single quote', () => {
    expect(phoneme.convert('let’s')).toBe('')
  })

  test('UTF-8 double quote', () => {
    expect(phoneme.convert('He says ”I don’t want to go anywhere.”')).toBe('')
  })
})
