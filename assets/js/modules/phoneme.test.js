import Dictionary from './dictionary.js'
import Phoneme from './phoneme.js'

const dictionary = new Dictionary('assets/resources/en_US.json')
const phoneme = new Phoneme(dictionary.load())

xdescribe('formatInput', () => {
  test('UTF-8 single quote', () => {
    expect(phoneme.convert('let’s')).toBe('')
  })

  test('UTF-8 double quote', () => {
    expect(phoneme.convert('He says ”I don’t want to go anywhere.”')).toBe('')
  })
})

xdescribe('longVowelize', () => {
  test('ɑ', () => {
    expect(phoneme.convert('stop')).toBe('')
    expect(phoneme.convert('shot')).toBe('')
    expect(phoneme.convert('father')).toBe('')
    expect(phoneme.convert('watch')).toBe('')
    expect(phoneme.convert('lot')).toBe('')
    expect(phoneme.convert('spa')).toBe('')
    expect(phoneme.convert('doctor’s office')).toBe('')
    expect(phoneme.convert('logical model')).toBe('')
    expect(phoneme.convert('job hop')).toBe('')
  })

  test('ɔ', () => {
    expect(phoneme.convert('bought')).toBe('')
    expect(phoneme.convert('talk')).toBe('')
    expect(phoneme.convert('small')).toBe('')
    expect(phoneme.convert('awesome')).toBe('')
    expect(phoneme.convert('small talk')).toBe('')
    expect(phoneme.convert('walk the dog')).toBe('')
    expect(phoneme.convert('long ball')).toBe('')
    expect(phoneme.convert('cot')).toBe('')
    expect(phoneme.convert('caught')).toBe('')
    expect(phoneme.convert('start talking')).toBe('')
    expect(phoneme.convert('a lot of dogs')).toBe('')
    expect(phoneme.convert('my father’s thought')).toBe('')
  })

  test('i', () => {
    expect(phoneme.convert('speak')).toBe('')
    expect(phoneme.convert('deep')).toBe('')
    expect(phoneme.convert('he')).toBe('')
    expect(phoneme.convert('read the email')).toBe('')
    expect(phoneme.convert('extremely busy')).toBe('')
    expect(phoneme.convert('green peas')).toBe('')
  })

  test('u', () => {
    expect(phoneme.convert('choose')).toBe('')
    expect(phoneme.convert('too')).toBe('')
    expect(phoneme.convert('two spoons')).toBe('')
    expect(phoneme.convert('super duper')).toBe('')
    expect(phoneme.convert('new school')).toBe('')
  })

  test('ɜ', () => {
    expect(phoneme.convert('eternal')).toBe('')
    expect(phoneme.convert('certain')).toBe('')
    expect(phoneme.convert('curtain')).toBe('')
    expect(phoneme.convert('worth')).toBe('')
    expect(phoneme.convert('search')).toBe('')
    expect(phoneme.convert('surge')).toBe('')
    expect(phoneme.convert('world')).toBe('')
    expect(phoneme.convert('girl')).toBe('')
    expect(phoneme.convert('curl')).toBe('')
    expect(phoneme.convert('your')).toBe('')
  })

  test('ɝ', () => {
    expect(phoneme.convert('first')).toBe('ˈfɝːst')
    expect(phoneme.convert('third')).toBe('ˈθɝːd')
    expect(phoneme.convert('person')).toBe('ˈpɝːsən')
    expect(phoneme.convert('work')).toBe('ˈwɝːk')
  })
})
