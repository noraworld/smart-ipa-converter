// https://pisuke-code.com/js-convert-string-to-boolean/
export function stringToBoolean(str) {
  if (typeof str !== 'string') return Boolean(str)

  try {
    return JSON.parse(str.toLowerCase()) === true
  }
  catch {
    return str !== ''
  }
}
