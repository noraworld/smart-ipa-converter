export function get(name) {
  for (const cookie of document.cookie.split(';')) {
    const key = cookie.trim().split('=')[0]
    const value = cookie.trim().split('=')[1]

    if (key === name) {
      return value
    }
  }

  return null
}
