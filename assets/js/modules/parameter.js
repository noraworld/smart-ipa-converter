// https://www-creators.com/archives/4463
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
export function get(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  let results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export function set(value) {
  if (value) {
    history.replaceState('', '', value)
  }
  else {
    history.replaceState('', '', '/')
  }
}
